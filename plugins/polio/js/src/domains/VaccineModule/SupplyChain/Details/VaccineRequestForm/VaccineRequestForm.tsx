import React, { FunctionComponent } from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import { commonStyles, useSafeIntl } from 'bluesquare-components';
import { SingleSelect } from '../../../../../components/Inputs/SingleSelect';
import { MultiSelect } from '../../../../../components/Inputs/MultiSelect';
import { DateInput } from '../../../../../components/Inputs/DateInput';
import { NumberInput } from '../../../../../components/Inputs';
import { TextArea } from '../../../../../../../../../hat/assets/js/apps/Iaso/components/forms/TextArea';
import { useCampaignDropDowns, useGetCountriesOptions } from '../../hooks/api';
import { Router } from '../../../../../../../../../hat/assets/js/apps/Iaso/types/general';

type Props = { className?: string; router: Router };
const useStyles = makeStyles(theme => ({ ...commonStyles(theme) }));

export const VaccineRequestForm: FunctionComponent<Props> = ({
    className,
    router,
}) => {
    const classes: Record<string, string> = useStyles();
    const { formatMessage } = useSafeIntl();
    const { data: countriesOptions, isFetching: isFetchingCountries } =
        useGetCountriesOptions();

    // TODO manage errors, allowConfirm
    const { values } = useFormikContext<any>();
    const {
        campaigns,
        vaccines,
        rounds,
        isFetching: isFetchingDropDowns,
    } = useCampaignDropDowns(
        values.vrf.country,
        values.vrf.campaign,
        values.vrf.vaccine_type,
    );

    return (
        <>
            <Box mb={2}>
                <Typography variant="h5">Vaccine request form</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Country"
                            name="vrf.country"
                            component={SingleSelect}
                            disabled={false}
                            required
                            isLoading={
                                isFetchingCountries || isFetchingDropDowns
                            }
                            options={countriesOptions}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Campaign"
                            name="vrf.campaign"
                            component={SingleSelect}
                            disabled={!values.vrf.country}
                            required
                            options={campaigns}
                            isLoading={
                                isFetchingCountries || isFetchingDropDowns
                            }
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Vaccine type"
                            name="vrf.vaccine_type"
                            component={SingleSelect}
                            disabled={!values.vrf.campaign}
                            required
                            options={vaccines}
                            isLoading={
                                isFetchingCountries || isFetchingDropDowns
                            }
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        {/* TODO handle values */}
                        <Field
                            label="Rounds"
                            name="vrf.rounds"
                            component={MultiSelect}
                            disabled={!values.vrf.vaccine_type}
                            required
                            options={rounds}
                            isLoading={
                                isFetchingCountries || isFetchingDropDowns
                            }
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Box mt={2}>
                            <Field
                                label="Date of VRF signature"
                                name="vrf.date_vrf_signature"
                                component={DateInput}
                                disabled={false}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Box mt={2}>
                            <Field
                                label="Quantity ordered in doses"
                                name="vrf.quantities_ordered_in_doses"
                                component={NumberInput}
                                disabled={false}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Box mt={2}>
                            <Field
                                label="Wastage ratio"
                                name="vrf.wastage_rate_used_on_vrf"
                                component={NumberInput}
                                disabled={false}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Box mt={2}>
                            <Field
                                label="Date of VRF reception"
                                name="vrf.date_vrf_reception"
                                component={DateInput}
                                disabled={false}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Date of VRF submission ORPG"
                            name="vrf.date_vrf_submission_to_orpg"
                            component={DateInput}
                            disabled={false}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Quantity approved by ORPG in doses"
                            name="vrf.quantities_approved_by_orpg_in_doses"
                            component={NumberInput}
                            disabled={false}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Date of RRT/ORPG approval"
                            name="vrf.date_rrt_orpg_approval"
                            component={DateInput}
                            disabled={false}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Date of VRF submission to DG"
                            name="vrf.date_vrf_submission_dg"
                            component={DateInput}
                            disabled={false}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Quantity approved by DG in doses"
                            name="vrf.quantities_approved_by_dg_in_doses"
                            component={NumberInput}
                            disabled={false}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            label="Date of DG approval"
                            name="vrf.date_dg_approval"
                            component={DateInput}
                            disabled={false}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} md={9} lg={6} spacing={1}>
                    <Grid item xs={12}>
                        <TextArea
                            value={values.vrf.comment}
                            // errors={getErrors('comment')}
                            label="Comments"
                            onChange={() => null}
                            // required={requiredFields.includes('comment')}
                            debounceTime={0}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};
