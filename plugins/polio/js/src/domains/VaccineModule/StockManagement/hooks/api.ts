import { UseQueryResult } from 'react-query';
import { UrlParams } from 'bluesquare-components';
import { useUrlParams } from '../../../../../../../../hat/assets/js/apps/Iaso/hooks/useUrlParams';
import {
    FormattedApiParams,
    useApiParams,
} from '../../../../../../../../hat/assets/js/apps/Iaso/hooks/useApiParams';
import {
    useSnackMutation,
    useSnackQuery,
} from '../../../../../../../../hat/assets/js/apps/Iaso/libs/apiHooks';
import { waitFor } from '../../../../../../../../hat/assets/js/apps/Iaso/utils';
import { mockVaccineStockList } from '../mocks/mockVaccineStockList';
import {
    mockSummary,
    mockUnusableVials,
    mockUsableVials,
} from '../mocks/mockVaccineStockDetails';
import {
    StockManagementListParams,
    StockManagementDetailsParams,
    StockVariationParams,
} from '../types';
import {
    mockDestructionsList,
    mockFormAList,
    mockIncidentsList,
} from '../mocks/mockStockVariation';
import {
    CAMPAIGNS_ENDPOINT,
    useGetCampaigns,
} from '../../../Campaigns/hooks/api/useGetCampaigns';

const defaults = {
    order: 'country',
    pageSize: 20,
    page: 1,
};
const options = {
    select: data => {
        if (!data) return { results: [] };
        return data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 15, // in MS
    cacheTime: 1000 * 60 * 5,
    // automatically refetch after a time to update data changed by other users
    refetchInterval: 1000 * 60 * 5,
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const getVaccineStockList = async (params: FormattedApiParams) => {
    const queryString = new URLSearchParams(params).toString();
    await waitFor(750);
    console.log('list params', queryString);
    return mockVaccineStockList;
};

export const useGetVaccineStockList = (
    params: StockManagementListParams,
): UseQueryResult<any, any> => {
    const safeParams = useUrlParams(params, defaults);
    const apiParams = useApiParams(safeParams);
    // TODO all quey keys here need to be invalidated if an update has been made in supplychain > VAR part of the module
    return useSnackQuery({
        queryKey: [
            'vaccine-stock-list',
            apiParams,
            apiParams.page,
            apiParams.limit,
            apiParams.order,
        ],
        queryFn: () => getVaccineStockList(apiParams),
        options,
    });
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const getUsableVials = async (queryString: string) => {
    console.log('usable vials', queryString);
    await waitFor(750);
    return mockUsableVials;
};

// Need to pass id to apiUrl
export const useGetUsableVials = (
    params: StockManagementDetailsParams,
    enabled: boolean,
): UseQueryResult<any, any> => {
    const {
        usableVialsOrder: order,
        usableVialsPage: page,
        usableVialsPageSize: pageSize,
    } = params;
    const safeParams = useUrlParams({
        order,
        page,
        pageSize,
    } as Partial<UrlParams>);
    const apiParams = useApiParams(safeParams);
    const queryString = new URLSearchParams(apiParams).toString();
    return useSnackQuery({
        queryKey: ['usable-vials', queryString],
        queryFn: () => getUsableVials(queryString),
        options: { ...options, enabled },
    });
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const getUnusableVials = async (queryString: string) => {
    console.log('unusable vials', queryString);
    await waitFor(750);
    return mockUnusableVials;
};
// Need to pass id to apiUrl
// Splitting both hooks to be able to store both payloads in the cache and avoid refteching with each tab change
export const useGetUnusableVials = (
    params: StockManagementDetailsParams,
    enabled: boolean,
): UseQueryResult<any, any> => {
    const {
        unusableVialsOrder: order,
        unusableVialsPage: page,
        unusableVialsPageSize: pageSize,
    } = params;
    const safeParams = useUrlParams({
        order,
        page,
        pageSize,
    } as Partial<UrlParams>);
    const apiParams = useApiParams(safeParams);
    const queryString = new URLSearchParams(apiParams).toString();
    return useSnackQuery({
        queryKey: ['unusable-vials', queryString],
        queryFn: () => getUnusableVials(queryString),
        options: { ...options, enabled },
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const getStockManagementSummary = async (id?: string) => {
    console.log('vaccine stock id', id);
    await waitFor(500);
    return mockSummary;
};

export const useGetStockManagementSummary = (
    id?: string,
): UseQueryResult<any, any> => {
    return useSnackQuery({
        queryKey: ['stock-management-summary', id],
        queryFn: () => getStockManagementSummary(id),
        options: { ...options, enabled: Boolean(id) },
    });
};

const getFormAList = async (queryString: string) => {
    await waitFor(750);
    console.log('forma params', queryString);
    return mockFormAList;
};

export const useGetFormAList = (
    params: StockVariationParams,
    enabled: boolean,
): UseQueryResult<any, any> => {
    const {
        formaOrder: order,
        formaPage: page,
        formaPageSize: pageSize,
    } = params;
    const safeParams = useUrlParams({
        order,
        page,
        pageSize,
    } as Partial<UrlParams>);
    const apiParams = useApiParams(safeParams);
    const queryString = new URLSearchParams(apiParams).toString();
    return useSnackQuery({
        queryKey: ['formA', queryString],
        queryFn: () => getFormAList(queryString),
        options: { ...options, enabled },
    });
};
const getDestructionList = async (queryString: string) => {
    await waitFor(750);
    console.log('destruction params', queryString);
    return mockDestructionsList;
};

export const useGetDestructionList = (
    params: StockVariationParams,
    enabled: boolean,
): UseQueryResult<any, any> => {
    const {
        destructionOrder: order,
        destructionPage: page,
        destructionPageSize: pageSize,
    } = params;
    const safeParams = useUrlParams({
        order,
        page,
        pageSize,
    } as Partial<UrlParams>);
    const apiParams = useApiParams(safeParams);
    const queryString = new URLSearchParams(apiParams).toString();
    return useSnackQuery({
        queryKey: ['destruction', queryString],
        queryFn: () => getDestructionList(queryString),
        options: { ...options, enabled },
    });
};
const getIncidentList = async (queryString: string) => {
    await waitFor(750);
    console.log('incidents params', queryString);
    return mockIncidentsList;
};

export const useGetIncidentList = (
    params: StockVariationParams,
    enabled: boolean,
): UseQueryResult<any, any> => {
    const {
        incidentOrder: order,
        incidentPage: page,
        incidentPageSize: pageSize,
    } = params;
    const safeParams = useUrlParams({
        order,
        page,
        pageSize,
    } as Partial<UrlParams>);
    const apiParams = useApiParams(safeParams);
    const queryString = new URLSearchParams(apiParams).toString();
    return useSnackQuery({
        queryKey: ['incidents', queryString],
        queryFn: () => getIncidentList(queryString),
        options: { ...options, enabled },
    });
};

export const useCampaignOptions = (countryName, vaccine) => {
    const queryOptions = {
        select: data => {
            if (!data) return [];
            return data
                .filter(c => c.top_level_org_unit_name === countryName)
                .map(c => {
                    return {
                        label: c.obr_name,
                        value: c.obr_name,
                    };
                });
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 15, // in MS
        cacheTime: 1000 * 60 * 5,
    };
    return useGetCampaigns({}, CAMPAIGNS_ENDPOINT, undefined, queryOptions);
};

const createEditFormA = async (body: any) => {
    await waitFor(500);
    if (body.id) {
        console.log('PATCH', body);
    } else {
        console.log('POST', body);
    }
    return null;
};

export const useSaveFormA = () => {
    return useSnackMutation({
        mutationFn: body => createEditFormA(body),
    });
};
const createEditDestruction = async (body: any) => {
    await waitFor(500);
    if (body.id) {
        console.log('PATCH', body);
    } else {
        console.log('POST', body);
    }
    return null;
};

export const useSaveDestruction = () => {
    return useSnackMutation({
        mutationFn: body => createEditDestruction(body),
    });
};
const createEditIncident = async (body: any) => {
    await waitFor(500);
    if (body.id) {
        console.log('PATCH', body);
    } else {
        console.log('POST', body);
    }
    return null;
};

export const useSaveIncident = () => {
    return useSnackMutation({
        mutationFn: body => createEditIncident(body),
    });
};
