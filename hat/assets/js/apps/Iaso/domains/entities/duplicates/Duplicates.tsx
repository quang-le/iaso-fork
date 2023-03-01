import React, { FunctionComponent } from 'react';
import { useSafeIntl, commonStyles } from 'bluesquare-components';
import { useDispatch } from 'react-redux';
import { Box, makeStyles } from '@material-ui/core';
import { PaginationParams } from '../../../types/general';
import MESSAGES from './messages';
import TopBar from '../../../components/nav/TopBarComponent';
import { useGetDuplicates } from './hooks/useGetDuplicates';
import { TableWithDeepLink } from '../../../components/tables/TableWithDeepLink';
import { redirectTo } from '../../../routing/actions';
import { baseUrls } from '../../../constants/urls';
import { useDuplicationTableColumns } from './hooks/useDuplicationTableColumns';
import { DuplicatesFilters } from './DuplicatesFilters';

type Params = PaginationParams & { search?: string; accountId?: string };

type Props = {
    params: Params;
};
const baseUrl = baseUrls.entityDuplicates;

const defaultSorted = [{ id: 'similarity_star', desc: true }];

const useStyles = makeStyles(theme => {
    return {
        ...commonStyles(theme),
    };
});

export const Duplicates: FunctionComponent<Props> = ({ params }) => {
    const { formatMessage } = useSafeIntl();
    const classes: Record<string, string> = useStyles();
    const { data, isFetching } = useGetDuplicates();
    const dispatch = useDispatch();
    const columns = useDuplicationTableColumns();
    const { results, pages, count } = data ?? {
        results: [],
        pages: 1,
        count: 0,
    };
    return (
        <>
            <TopBar
                title={formatMessage(MESSAGES.duplicates)}
                displayBackButton={false}
            />
            <Box className={classes.containerFullHeightNoTabPadded}>
                <DuplicatesFilters params={params} />
                <TableWithDeepLink
                    marginTop={false}
                    data={results}
                    pages={pages}
                    defaultSorted={defaultSorted}
                    columns={columns}
                    count={count ?? 0}
                    baseUrl={baseUrl}
                    params={params}
                    extraProps={{ loading: isFetching }}
                    onTableParamsChange={p => dispatch(redirectTo(baseUrl, p))}
                />
            </Box>
        </>
    );
};
