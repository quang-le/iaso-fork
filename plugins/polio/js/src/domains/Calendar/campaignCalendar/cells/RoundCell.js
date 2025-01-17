import React, { useState, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { TableCell, Box } from '@mui/material';

import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { PolioCreateEditDialog as CreateEditDialog } from '../../../Campaigns/MainDialog/CreateEditDialog';
import { RoundPopper } from '../popper/RoundPopper';
import { useStyles } from '../Styles';
import { RoundPopperContext } from '../contexts/RoundPopperContext.tsx';
import { polioVaccines } from '../../../../constants/virus.ts';

const getVaccineColor = vaccine =>
    polioVaccines.find(polioVaccine => polioVaccine.value === vaccine)?.color ||
    '#bcbcbc';

const RoundCell = ({ colSpan, campaign, round }) => {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);

    const { anchorEl, setAnchorEl } = useContext(RoundPopperContext);
    const [self, setSelf] = useState(null);

    const handleClick = useCallback(
        event => {
            if (!self) {
                setSelf(event.currentTarget);
            }
            setAnchorEl(
                isEqual(event.currentTarget, anchorEl)
                    ? null
                    : event.currentTarget,
            );
        },
        [anchorEl, self, setAnchorEl],
    );

    const handleClose = () => {
        setAnchorEl(null);
    };

    const defaultCellStyles = [classes.tableCell, classes.tableCellBordered];
    const open = self && isEqual(self, anchorEl);
    const isLogged = useSelector(state => Boolean(state.users.current));
    const vaccinesList = useMemo(() => {
        const list = campaign.separateScopesPerRound
            ? round.vaccine_names?.split(',') ?? []
            : campaign.original.vaccines?.split(',') ?? [];
        return list.map(vaccineName => vaccineName.trim());
    }, [
        campaign.original.vaccines,
        campaign.separateScopesPerRound,
        round.vaccine_names,
    ]);

    return (
        <TableCell
            className={classnames(defaultCellStyles, classes.round)}
            colSpan={colSpan}
        >
            <Box
                className={classes.coloredBox}
                style={{ backgroundColor: campaign.color }}
            >
                {vaccinesList.map(vaccine => (
                    <span
                        key={`${campaign.uuid}-${round.number}-${vaccine}`}
                        style={{
                            backgroundColor: getVaccineColor(vaccine),
                            display: 'block',
                            height: `${100 / vaccinesList.length}%`,
                        }}
                    />
                ))}
            </Box>
            <span
                onClick={handleClick}
                role="button"
                tabIndex="0"
                className={classnames(
                    classes.tableCellSpan,
                    classes.tableCellSpanWithPopOver,
                )}
            >
                {colSpan > 1 && `R${round.number}`}
            </span>
            {open && (
                <RoundPopper
                    open={open}
                    round={round}
                    anchorEl={anchorEl}
                    campaign={campaign}
                    handleClose={handleClose}
                    setDialogOpen={setDialogOpen}
                />
            )}
            {isLogged && (
                <CreateEditDialog
                    campaignId={campaign.original.id}
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                />
            )}
        </TableCell>
    );
};

RoundCell.propTypes = {
    colSpan: PropTypes.number.isRequired,
    campaign: PropTypes.object.isRequired,
    round: PropTypes.object.isRequired,
};

export { RoundCell };
