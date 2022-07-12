/* eslint-disable camelcase */
import moment from 'moment';
import { UseQueryResult } from 'react-query';
import { getRequest } from '../../../../libs/Api';
import { useSnackQuery } from '../../../../libs/apiHooks';
import { Instance } from '../../types/instance';

const getInstanceLog = (instanceId: string | undefined): Promise<Instance> => {
    return getRequest(`/api/logs/?objectId=${instanceId}`);
};
export const useGetInstanceLogs = (
    instanceId: string | undefined,
): UseQueryResult<Instance, Error> => {
    const queryKey: any[] = ['instanceLog', instanceId];
    // @ts-ignore
    return useSnackQuery(
        queryKey,
        () => getInstanceLog(instanceId),
        undefined,
        {
            enabled: Boolean(instanceId),
            select: data => {
                if (!data) return [];
                // @ts-ignore
                const dataSorted = data.sort(
                    (instanceLogA, instanceLogB) =>
                        instanceLogB.id - instanceLogA.id,
                );
                return dataSorted.map((instanceLog: Instance) => {
                    return {
                        value: instanceLog.id,
                        label: moment(instanceLog.created_at).format('LTS'),
                        original: instanceLog,
                    };
                });
            },
        },
    );
};
