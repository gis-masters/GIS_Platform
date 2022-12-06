import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { MyLocation } from '@mui/icons-material';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { SimpleGeometry } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import { Extent } from 'ol/extent';
import Point from 'ol/geom/Point';
import { Feature } from 'ol';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';

import { mapService } from '../../../services/map/map.service';
import { getRosreestrSingleAreaData, getRosreestrSingleOksData } from '../../../services/rosreestr-data.service';
import { KadItem, KadObject } from '../../../services/kad-search.models';
import { services } from '../../../services/services';
import { Toast } from '../../Toast/Toast';

const cnSearch = cn('Search');

export interface SearchResultKadListItemProps {
  kadObject: KadObject;
}

@observer
export class SearchResultKadListItem extends Component<SearchResultKadListItemProps> {
  @observable private pointExist = true;

  constructor(props: SearchResultKadListItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
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
    const kadNum = this.props.kadObject.value;
    try {
      mapService.clearMarkers();

      const value = await Promise.all([getRosreestrSingleAreaData(kadNum), getRosreestrSingleOksData(kadNum)]);

      const item = value.flat(2)[0] as KadItem | undefined;

      if (item?.center) {
        const center = item.center;

        this.drawMarker([center.x, center.y]);

        this.fitToBbox([center.x, center.x, center.y, center.y], [0, 0, 0, 0], 0.85);
      } else {
        this.pointNotExist();
      }
    } catch (error) {
      const err = error as AxiosError;
      Toast.warn(`Ошибка ответа росреестра ${kadNum}`);
      services.logger.error(`Ошибка ответа росреестра: ${kadNum}`, err.message);
    }
  }

  private fitToBbox(extent: Extent, padding: [number, number, number, number], minResolution: number) {
    mapService.fitToBbox([extent[1], extent[2], extent[0], extent[3]], padding, minResolution);
  }

  private drawMarker(pos: number[]) {
    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
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
