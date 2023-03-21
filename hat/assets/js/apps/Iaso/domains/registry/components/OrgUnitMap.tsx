import React, { FunctionComponent, useState, useRef, useCallback } from 'react';
import {
    Map,
    TileLayer,
    GeoJSON,
    Pane,
    ScaleControl,
    Tooltip,
} from 'react-leaflet';
import { useSkipEffectOnMount } from 'bluesquare-components';
import { Box } from '@material-ui/core';
import L from 'leaflet';

import { TilesSwitch, Tile } from '../../../components/maps/tools/TileSwitch';

import { OrgUnit } from '../../orgUnits/types/orgUnit';

import tiles from '../../../constants/mapTiles';

const defaultViewport = {
    center: [1, 20],
    zoom: 3.25,
};
const boundsOptions = {
    padding: [50, 50],
};
type Props = {
    orgUnit?: OrgUnit;
    isLoading: boolean;
};

export const OrgUnitMap: FunctionComponent<Props> = ({
    orgUnit,
    isLoading,
}) => {
    // const classes: Record<string, string> = useStyles();
    const map: any = useRef();
    const [currentTile, setCurrentTile] = useState<Tile>(tiles.osm);
    const fitToBounds = useCallback(() => {
        let newBounds;
        if (orgUnit?.geo_json) {
            newBounds = L.geoJSON(orgUnit.geo_json).getBounds();
        }
        if (newBounds) {
            try {
                map.current?.leafletElement.fitBounds(newBounds, boundsOptions);
            } catch (e) {
                console.warn(e);
            }
        }
    }, [orgUnit]);
    useSkipEffectOnMount(() => {
        if (orgUnit?.geo_json) {
            fitToBounds();
        }
    }, [orgUnit?.geo_json]);
    console.log('orgUnit', orgUnit);
    return (
        <Box position="relative">
            <TilesSwitch
                currentTile={currentTile}
                setCurrentTile={setCurrentTile}
            />
            <Map
                isLoading={isLoading}
                zoomSnap={0.25}
                maxZoom={currentTile.maxZoom}
                ref={map}
                style={{ height: '65vh' }}
                center={defaultViewport.center}
                zoom={defaultViewport.zoom}
                scrollWheelZoom={false}
                zoomControl={false}
                contextmenu
            >
                <ScaleControl imperial={false} />
                <TileLayer
                    attribution={currentTile.attribution ?? ''}
                    url={currentTile.url}
                />
                {orgUnit?.geo_json && (
                    <Pane name="orgunit-shapes">
                        <GeoJSON
                            // onClick={() => onClick(shape)}
                            className="secondary"
                            data={orgUnit.geo_json}
                        >
                            <Tooltip>{orgUnit.name}</Tooltip>
                        </GeoJSON>
                    </Pane>
                )}
            </Map>
        </Box>
    );
};
