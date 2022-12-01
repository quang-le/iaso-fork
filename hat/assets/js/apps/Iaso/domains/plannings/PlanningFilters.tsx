import { Box, Grid, useTheme, useMediaQuery } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
// @ts-ignore
import { useSafeIntl } from 'bluesquare-components';
import { FilterButton } from '../../components/FilterButton';
import DatesRange from '../../components/filters/DatesRange';
import InputComponent from '../../components/forms/InputComponent';
import { useFilterState } from '../../hooks/useFilterState';
import { PlanningParams } from './types';
import MESSAGES from './messages';
import { IntlFormatMessage } from '../../types/intl';
import { publishingStatuses } from './constants';
import { baseUrls } from '../../constants/urls';

type Props = {
    params: PlanningParams;
};

const statusOptions = (formatMessage: IntlFormatMessage) => {
    return publishingStatuses.map(status => {
        return {
            value: status,
            label: formatMessage(MESSAGES[status]),
        };
    });
};
const baseUrl = baseUrls.planning;
export const PlanningFilters: FunctionComponent<Props> = ({ params }) => {
    const { filters, handleSearch, handleChange, filtersUpdated } =
        useFilterState({ baseUrl, params });
    const { formatMessage } = useSafeIntl();
    const theme = useTheme();
    const isLargeLayout = useMediaQuery(theme.breakpoints.up('md'));
    return (
        <>
            <Grid container spacing={0}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <InputComponent
                            keyValue="search"
                            onChange={handleChange}
                            value={filters.search}
                            type="search"
                            label={MESSAGES.search}
                            onEnterPressed={handleSearch}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatesRange
                            onChangeDate={handleChange}
                            dateFrom={filters.dateFrom}
                            dateTo={filters.dateTo}
                            labelFrom={MESSAGES.startDatefrom}
                            labelTo={MESSAGES.endDateUntil}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <InputComponent
                            type="select"
                            multi={false}
                            keyValue="publishingStatus"
                            onChange={handleChange}
                            value={filters.publishingStatus}
                            options={statusOptions(formatMessage)}
                            label={MESSAGES.publishingStatus}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} justifyContent="flex-end">
                    <Box mt={isLargeLayout ? 0 : 2} mb={2}>
                        <FilterButton
                            disabled={!filtersUpdated}
                            onFilter={handleSearch}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};
