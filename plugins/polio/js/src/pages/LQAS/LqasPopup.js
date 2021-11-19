import React, { useRef } from 'react';
import {
    commonStyles,
    mapPopupStyles,
    useSafeIntl,
} from 'bluesquare-components';
import { Popup } from 'react-leaflet';
import PopupItemComponent from 'Iaso/components/maps/popups/PopupItemComponent';
import { makeStyles, Card, CardContent } from '@material-ui/core';
import { object, string } from 'prop-types';
import MESSAGES from '../../constants/messages';
import { findLQASDataForShape } from './utils';

const style = theme => {
    return { ...commonStyles(theme), ...mapPopupStyles(theme) };
};

const useStyle = makeStyles(style);

export const LqasPopup = ({ shape, LQASData, round }) => {
    const classes = useStyle();
    const { formatMessage } = useSafeIntl();
    const ref = useRef();
    const dataForShape = findLQASDataForShape(shape.name, LQASData, round);
    return (
        <>
            {dataForShape && (
                <Popup className={classes.popup} ref={ref}>
                    <Card className={classes.popupCard}>
                        <CardContent className={classes.popupCardContent}>
                            <PopupItemComponent
                                label={formatMessage(MESSAGES.district)}
                                value={shape.name}
                                labelSize={6}
                                valueSize={6}
                            />
                            <PopupItemComponent
                                label={formatMessage(MESSAGES.childrenChecked)}
                                value={dataForShape.total_child_checked}
                                labelSize={6}
                                valueSize={6}
                            />
                            <PopupItemComponent
                                label={formatMessage(MESSAGES.childrenMarked)}
                                value={dataForShape.total_child_fmd}
                                labelSize={6}
                                valueSize={6}
                            />
                        </CardContent>
                    </Card>
                </Popup>
            )}
        </>
    );
};

LqasPopup.propTypes = {
    shape: object.isRequired,
    LQASData: object.isRequired,
    round: string.isRequired,
};

// LqasPopup.defaultProps={

// }
