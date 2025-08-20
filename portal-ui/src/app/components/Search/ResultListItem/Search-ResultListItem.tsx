import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Feature } from 'ol';
import { Extent } from 'ol/extent';
import { SimpleGeometry } from 'ol/geom';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import { mapService } from '../../../services/map/map.service';
import { getStyle, KnownStyleKey } from '../../../services/map/styles/map-styles';
import { YaGeoObject } from '../../../services/yandex-geocode.service';

const cnSearch = cn('Search');

export interface SearchResultListItemProps {
  geoObject: YaGeoObject;
}

@observer
export class SearchResultListItem extends Component<SearchResultListItemProps> {
  render() {
    const { name, description, Point } = this.props.geoObject;

    return (
      <ListItem key={Point.pos} className={cnSearch('ResultListItem')}>
        <ListItemText className={cnSearch('PrimaryText')} primary={name} secondary={description} />
        <ListItemSecondaryAction>
          <IconButton edge='end' onClick={this.handleClick}>
            <MyLocation />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  @boundMethod
  private handleClick() {
    mapService.clearMarkers();

    const { pos } = this.props.geoObject.Point;
    const posSplit = pos.split(' ');
    const { lowerCorner, upperCorner } = this.props.geoObject.boundedBy.Envelope;
    const lowerSplit = lowerCorner.split(' ');
    const upperSplit = upperCorner.split(' ');

    this.drawMarker([Number(posSplit[0]), Number(posSplit[1])]);
    this.fitToBbox(
      [Number(lowerSplit[0]), Number(lowerSplit[1]), Number(upperSplit[0]), Number(upperSplit[1])],
      [0, 0, 0, 0]
    );
  }

  private fitToBbox(extent: Extent, padding: [number, number, number, number]) {
    const lonLat1 = fromLonLat([extent[0], extent[1]]);
    const lonLat2 = fromLonLat([extent[2], extent[3]]);

    mapService.fitToBbox([lonLat1[0], lonLat1[1], lonLat2[0], lonLat2[1]], padding);
  }

  private drawMarker(pos: number[]) {
    const iconFeature = new Feature<SimpleGeometry>({
      geometry: new Point(fromLonLat(pos))
    });

    iconFeature.setStyle(getStyle(KnownStyleKey.MapMarkerStyles));

    mapService.drawMarkers([iconFeature]);
  }
}
