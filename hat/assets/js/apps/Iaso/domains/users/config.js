import React, { useMemo } from 'react';
import { textPlaceholder, useSafeIntl } from 'bluesquare-components';
import { Switch } from '@mui/material';
import {
    HighlightOffOutlined as NotCheckedIcon,
    CheckCircleOutlineOutlined as CheckedIcon,
} from '@mui/icons-material';

import { EditUsersDialog } from './components/UsersDialog.tsx';
import DeleteDialog from '../../components/dialogs/DeleteDialogComponent';
import MESSAGES from './messages';
import { userHasPermission } from './utils';

import * as Permission from '../../utils/permissions.ts';
import PermissionTooltip from './components/PermissionTooltip.tsx';

export const usersTableColumns = ({
    formatMessage,
    deleteProfile,
    params,
    currentUser,
    saveProfile,
}) => [
    {
        Header: formatMessage(MESSAGES.userName),
        id: 'user__username',
        accessor: 'user_name',
    },
    {
        Header: formatMessage(MESSAGES.firstName),
        id: 'user__first_name',
        accessor: 'first_name',
    },
    {
        Header: formatMessage(MESSAGES.lastName),
        id: 'user__last_name',
        accessor: 'last_name',
    },
    {
        Header: formatMessage(MESSAGES.email),
        id: 'user__email',
        accessor: 'email',
        Cell: settings =>
            settings.value ? (
                <a href={`mailto:${settings.value}`}>{settings.value}</a>
            ) : (
                textPlaceholder
            ),
    },
    {
        Header: formatMessage(MESSAGES.actions),
        accessor: 'actions',
        resizable: false,
        sortable: false,
        Cell: settings => (
            <section>
                <EditUsersDialog
                    initialData={settings.row.original}
                    titleMessage={MESSAGES.updateUser}
                    params={params}
                    saveProfile={saveProfile}
                />
                {currentUser.id !== settings.row.original.id &&
                    userHasPermission(Permission.USERS_ADMIN, currentUser) && (
                        <DeleteDialog
                            disabled={settings.row.original.instances_count > 0}
                            titleMessage={MESSAGES.deleteUserTitle}
                            message={MESSAGES.deleteUserText}
                            onConfirm={() =>
                                deleteProfile(settings.row.original)
                            }
                        />
                    )}
            </section>
        ),
    },
];

export const useUserPermissionColumns = ({ setPermissions, currentUser }) => {
    const { formatMessage } = useSafeIntl();
    return useMemo(() => {
        const columns = [
            {
                Header: '',
                id: 'tooltip',
                sortable: false,
                align: 'center',
                width: 50,
                Cell: settings => {
                    return (
                        <PermissionTooltip
                            codename={`${settings.row.original.permissionCodeName}_tooltip`}
                        />
                    );
                },
            },
            {
                Header: formatMessage(MESSAGES.permissions),
                id: 'permission',
                accessor: 'permission',
                sortable: false,
                width: 250,
                align: 'left',
            },
            {
                Header: formatMessage(MESSAGES.userPermissions),
                id: 'userPermission',
                accessor: 'userPermission',
                sortable: false,
                Cell: settings => {
                    return (
                        <Switch
                            className="permission-checkbox"
                            id={`permission-checkbox-${settings.row.original.permissionCodeName}`}
                            checked={Boolean(
                                settings.row.original.userPermissions.find(
                                    up =>
                                        up ===
                                        settings.row.original
                                            .permissionCodeName,
                                ),
                            )}
                            onChange={e =>
                                setPermissions(
                                    settings.row.original.permissionCodeName,
                                    e.target.checked,
                                )
                            }
                            name={settings.row.original.permissionCodeName}
                            color="primary"
                        />
                    );
                },
            },
        ];

        currentUser.user_roles_permissions.value.forEach(role => {
            columns.push({
                Header: role.name,
                id: role.id.toString(),
                accessor: role.id.toString(),
                sortable: false,
                width: 50,
                Cell: settings => {
                    if (
                        role.permissions.find(
                            permission =>
                                permission ===
                                settings.row.original.permissionCodeName,
                        )
                    ) {
                        return <CheckedIcon style={{ color: 'green' }} />;
                    }
                    return <NotCheckedIcon color="disabled" />;
                },
            });
        });
        return columns;
    }, [
        currentUser.user_roles_permissions.value,
        formatMessage,
        setPermissions,
    ]);
};
