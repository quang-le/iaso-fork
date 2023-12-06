import React, { FunctionComponent } from 'react';
import { Column, useSafeIntl } from 'bluesquare-components';
import MESSAGES from '../messages';
import { ApiNotificationsParams, NotificationsParams } from '../types';
import { useGetNotifications } from '../hooks/api';
import { NOTIFICATIONS_BASE_URL } from '../../../constants/routes';
import { DateCell } from '../../../../../../../hat/assets/js/apps/Iaso/components/Cells/DateTimeCell';
import { TableWithDeepLink } from '../../../../../../../hat/assets/js/apps/Iaso/components/tables/TableWithDeepLink';
import { handleTableDeepLink } from '../../../../../../../hat/assets/js/apps/Iaso/utils/table';

type Props = { params: NotificationsParams };

export const NotificationsTable: FunctionComponent<Props> = ({ params }) => {
    const apiParams: ApiNotificationsParams = {
        ...params,
        limit: params.pageSize || '20',
        order: params.order || 'id',
        page: params.page || '1',
    };
    const { data, isFetching } = useGetNotifications(apiParams);
    const { formatMessage } = useSafeIntl();
    const columns: Array<Column> = [
        {
            Header: formatMessage(MESSAGES.labelId),
            id: 'id',
            accessor: 'id',
        },
        {
            Header: formatMessage(MESSAGES.labelEpid),
            id: 'epid_number',
            accessor: 'epid_number',
        },
        {
            Header: formatMessage(MESSAGES.labelVdpvCategory),
            id: 'vdpv_category',
            accessor: 'vdpv_category',
        },
        {
            Header: formatMessage(MESSAGES.labelSource),
            id: 'source',
            accessor: 'source',
        },
        {
            Header: formatMessage(MESSAGES.labelVdpvNucleotideDiffSabin2),
            id: 'vdpv_nucleotide_diff_sabin2',
            accessor: 'vdpv_nucleotide_diff_sabin2',
        },
        {
            Header: formatMessage(MESSAGES.labelCountry),
            id: 'country',
            accessor: 'country',
            sortable: false,
        },
        {
            Header: formatMessage(MESSAGES.labelProvince),
            id: 'province',
            accessor: 'province',
            sortable: false,
        },
        {
            Header: formatMessage(MESSAGES.labelDistrict),
            id: 'district',
            accessor: 'district',
            sortable: false,
        },
        {
            Header: formatMessage(MESSAGES.labelSiteName),
            id: 'site_name',
            accessor: 'site_name',
        },
        {
            Header: formatMessage(MESSAGES.labelLineage),
            id: 'lineage',
            accessor: 'lineage',
        },
        {
            Header: formatMessage(MESSAGES.labelDateOfOnset),
            id: 'date_of_onset',
            accessor: 'date_of_onset',
            Cell: DateCell,
        },
        {
            Header: formatMessage(MESSAGES.labelClosestMatchVdpv2),
            id: 'closest_match_vdpv2',
            accessor: 'closest_match_vdpv2',
        },
        {
            Header: formatMessage(MESSAGES.labelDateResultsReceived),
            id: 'date_results_received',
            accessor: 'date_results_received',
            Cell: DateCell,
        },
    ];
    return (
        <TableWithDeepLink
            baseUrl={NOTIFICATIONS_BASE_URL}
            data={data?.results ?? []}
            pages={data?.pages ?? 1}
            columns={columns}
            count={data?.count ?? 0}
            params={params}
            onTableParamsChange={handleTableDeepLink(NOTIFICATIONS_BASE_URL)}
            extraProps={{ loading: isFetching }}
        />
    );
};
