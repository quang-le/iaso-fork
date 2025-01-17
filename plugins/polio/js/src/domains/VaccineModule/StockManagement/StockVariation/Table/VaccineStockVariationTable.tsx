import React, { FunctionComponent } from 'react';
import { Column, UrlParams } from 'bluesquare-components';
import { STOCK_VARIATION } from '../../../../../constants/routes';
import { SimpleTableWithDeepLink } from '../../../../../../../../../hat/assets/js/apps/Iaso/components/tables/SimpleTableWithDeepLink';
import { StockVariationTab } from '../../types';

type Props = {
    params: Partial<UrlParams>;
    paramsPrefix: StockVariationTab;
    data: { results?: any[]; count?: number; pages?: number };
    isFetching: boolean;
    columns?: Column[];
    defaultSorted: any;
};

export const VaccineStockVariationTable: FunctionComponent<Props> = ({
    params,
    paramsPrefix,
    data,
    isFetching,
    defaultSorted,
    columns = [],
}) => {
    return (
        // @ts-ignore
        <SimpleTableWithDeepLink
            data={data}
            params={params}
            paramsPrefix={paramsPrefix}
            columns={columns}
            defaultSorted={defaultSorted}
            baseUrl={STOCK_VARIATION}
            marginTop={false}
            elevation={0}
            extraProps={{
                loading: isFetching,
                params,
                defaultPageSize: 20,
            }}
        />
    );
};
