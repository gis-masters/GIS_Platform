import React, { Component, ReactNode } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { MyLocation } from '@mui/icons-material';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { SimpleGeometry } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import { Extent } from 'ol/extent';
import Point from 'ol/geom/Point';
import { Feature } from 'ol';
import { cn } from '@bem-react/classname';

import { mapService } from '../../../services/map/map.service';
import { getRosreestrSingleAreaData, getRosreestrSingleOksData } from '../../../services/rosreestr-data.service';
import { KadItem, KadObject } from '../../../services/kad-search.models';

const cnSearch = cn('Search');

export interface SearchResultKadListItemProps {
  kadObject: KadObject;
}

@observer
export class SearchResultKadListItem extends Component<SearchResultKadListItemProps> {
  @observable private pointExist = true;

  render(): ReactNode {
    const { value, title } = this.props.kadObject;

    return (
      <ListItem key={value} className={cnSearch('ResultListItem')}>
        <ListItemText
          className={cnSearch('PrimaryText')}
          primary={title}
          secondary={this.pointExist ? '' : 'Нет координат'}
        />
        <ListItemSecondaryAction>
          <IconButton edge='end' onClick={this.clickHandler}>
            <MyLocation />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  @boundMethod
  private async clickHandler() {
    mapService.clearMarkers();

    const value = await Promise.all([
      getRosreestrSingleAreaData(this.props.kadObject.value),
      getRosreestrSingleOksData(this.props.kadObject.value)
    ]);

    const item = value.flat(2)[0] as KadItem | undefined;

    if (item?.center) {
      const center = item.center;

      this.drawMarker([center.x, center.y]);

      this.fitToBbox([center.x, center.x, center.y, center.y], [0, 0, 0, 0], 0.85);
    } else {
      this.pointNotExist();
    }
  }

  private fitToBbox(extent: Extent, padding: [number, number, number, number], minResolution: number) {
    mapService.fitToBbox([extent[1], extent[2], extent[0], extent[3]], padding, minResolution);
  }

  private drawMarker(pos: number[]) {
    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: '/assets/images/map-marker.png'
      })
    });

    const iconFeature = new Feature<SimpleGeometry>({
      geometry: new Point(pos)
    });

    iconFeature.setStyle(iconStyle);

    mapService.drawMarkers([iconFeature]);
  }

  @action
  private pointNotExist() {
    this.pointExist = false;
  }
}
