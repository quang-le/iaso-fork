import django_filters

from rest_framework import filters
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError

from django.utils import timezone
from rest_framework.response import Response

from iaso.api.org_unit_change_requests.filters import OrgUnitChangeRequestListFilter
from iaso.api.org_unit_change_requests.pagination import OrgUnitChangeRequestPagination
from iaso.api.org_unit_change_requests.permissions import (
    HasOrgUnitsChangeRequestPermission,
    HasOrgUnitsChangeRequestReviewPermission,
)
from iaso.api.org_unit_change_requests.serializers import (
    OrgUnitChangeRequestListSerializer,
    OrgUnitChangeRequestRetrieveSerializer,
    OrgUnitChangeRequestReviewSerializer,
    OrgUnitChangeRequestWriteSerializer,
)
from iaso.api.serializers import AppIdSerializer
from iaso.models import OrgUnitChangeRequest, OrgUnit


class OrgUnitChangeRequestViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend]
    filterset_class = OrgUnitChangeRequestListFilter
    http_method_names = ["get", "options", "patch", "post", "head", "trace"]
    pagination_class = OrgUnitChangeRequestPagination

    def get_permissions(self):
        if self.action == "partial_update":
            permission_classes = [HasOrgUnitsChangeRequestReviewPermission]
        else:
            permission_classes = [HasOrgUnitsChangeRequestPermission]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return OrgUnitChangeRequestWriteSerializer
        if self.action in ["list", "metadata"]:
            return OrgUnitChangeRequestListSerializer
        if self.action == "retrieve":
            return OrgUnitChangeRequestRetrieveSerializer
        if self.action == "partial_update":
            return OrgUnitChangeRequestReviewSerializer

    def get_queryset(self):
        org_units = OrgUnit.objects.filter_for_user(self.request.user)
        org_units_change_requests = OrgUnitChangeRequest.objects.select_related(
            "created_by",
            "updated_by",
            "org_unit__parent",
            "org_unit__org_unit_type",
            "new_parent",
            "new_org_unit_type",
        ).prefetch_related(
            "org_unit__groups",
            "new_groups",
            "new_reference_instances",
        )
        return org_units_change_requests.filter(org_unit__in=org_units)

    def has_org_unit_permission(self, org_unit_to_change: OrgUnit) -> None:
        # The mobile adds `?app_id=.bar.baz` in the query params.
        app_id_serializer = AppIdSerializer(data=self.request.query_params)
        app_id_serializer.is_valid()
        app_id = app_id_serializer.validated_data.get("app_id")
        org_units = OrgUnit.objects.filter_for_user_and_app_id(self.request.user, app_id)
        if org_unit_to_change not in org_units:
            raise PermissionDenied("The user is trying to create a change request for an unauthorized OrgUnit.")

    def perform_create(self, serializer):
        """
        POST to create an `OrgUnitChangeRequest`.
        """
        org_unit_to_change = serializer.validated_data["org_unit"]
        self.has_org_unit_permission(org_unit_to_change)
        serializer.validated_data["created_by"] = self.request.user
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        """
        PATCH to approve or reject an `OrgUnitChangeRequest`.
        """
        change_request = self.get_object()
        self.has_org_unit_permission(change_request.org_unit)
        if change_request.status != change_request.Statuses.NEW:
            raise ValidationError(
                f"Status must be `{change_request.Statuses.NEW}` but current status is `{change_request.status}`."
            )

        serializer = self.get_serializer(change_request, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        status = serializer.validated_data["status"]

        if status == change_request.Statuses.APPROVED:
            change_request.approve(
                user=self.request.user,
                approved_fields=serializer.validated_data["approved_fields"],
            )

        if status == change_request.Statuses.REJECTED:
            change_request.reject(
                user=self.request.user,
                rejection_comment=serializer.validated_data["rejection_comment"],
            )

        response_serializer = OrgUnitChangeRequestRetrieveSerializer(change_request)
        return Response(response_serializer.data)
