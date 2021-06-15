import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { MyLocation } from '@material-ui/icons';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Extent } from 'ol/extent';
import Point from 'ol/geom/Point';
import { Feature } from 'ol';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { YaGeoObject } from '../../../services/yandex-geocode.service';
import { mapService } from '../../../services/map/map.service';

const cnSearch = cn('Search');

export interface SearchResultListItemProps {
  geoObject: YaGeoObject;
}

@observer
export class SearchResultListItem extends Component<SearchResultListItemProps> {
  render(): ReactNode {
    const { name, description, Point } = this.props.geoObject;

    return (
      <ListItem key={Point.pos} className={cnSearch('ResultListItem')}>
        <ListItemText className={cnSearch('PrimaryText')} primary={name} secondary={description} />
        <ListItemSecondaryAction>
          <IconButton edge='end' onClick={this.clickHandler}>
            <MyLocation />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  @boundMethod
  private clickHandler() {
    mapService.clearMarkers();

    const { pos } = this.props.geoObject.Point;
    const posSplited = pos.split(' ');
    const { lowerCorner, upperCorner } = this.props.geoObject.boundedBy.Envelope;
    const lowerSplited = lowerCorner.split(' ');
    const upperSplited = upperCorner.split(' ');

    this.drawMarker([Number(posSplited[0]), Number(posSplited[1])]);
    this.fitToBbox(
      [Number(lowerSplited[0]), Number(lowerSplited[1]), Number(upperSplited[0]), Number(upperSplited[1])],
      [0, 0, 0, 0]
    );
  }

  private fitToBbox(extent: Extent, padding: [number, number, number, number]) {
    const lonLat1 = fromLonLat([extent[0], extent[1]]);
    const lonLat2 = fromLonLat([extent[2], extent[3]]);

    mapService.fitToBbox([lonLat1[0], lonLat1[1], lonLat2[0], lonLat2[1]], padding);
  }

  private drawMarker(pos: number[]) {
    const lonLat = fromLonLat(pos);

    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: '/assets/images/map-marker.png'
      })
    });

    const iconFeature = new Feature({
      geometry: new Point(lonLat)
    });

    iconFeature.setStyle(iconStyle);

    mapService.drawMarkers([iconFeature]);
  }
}
