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

import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { mapService } from '../../../services/map/map.service';
import { getStyle, KnownStyleKey } from '../../../services/map/styles/map-styles';
import { services } from '../../../services/services';
import { calculateBbox } from '../../../services/util/Bbox';
import { wfsFeaturesToOlFeatures } from '../../../services/util/open-layers.util';
import { isCoordinate, isCoordinateArrayArray } from '../../../services/util/typeGuards/isCoordinate';
import { isNspdProperties, NspdProperties } from '../../../services/util/typeGuards/isNspdProperties';

const cnSearch = cn('Search');

export interface SearchResultKadListItemProps {
  feature: WfsFeature;
}

@observer
export class SearchResultKadListItem extends Component<SearchResultKadListItemProps> {
  render() {
    const { id } = this.props.feature;
    const properties: NspdProperties = this.props.feature.properties;

    if (!isNspdProperties(properties)) {
      services.logger.error('Ошибка проверки наличия свойств объекта');
    }

    return (
      <ListItem key={id} className={cnSearch('ResultListItem')}>
        <ListItemText
          className={cnSearch('PrimaryText')}
          primary={properties.label || ''}
          secondary={properties.options?.readable_address || ''}
        />
        <ListItemSecondaryAction>
          <IconButton edge='end' onClick={this.handleClick}>
            <MyLocation />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  private getPointCoordinates(coordinates: unknown): [number, number] | null {
    // Для точки
    if (isCoordinate(coordinates) && coordinates.length === 2) {
      return [coordinates[0], coordinates[1]];
    }
    // Для полигона (берем центроид первого кольца)
    if (isCoordinateArrayArray(coordinates) && coordinates.length > 0) {
      const ring = coordinates[0];

      if (ring.length > 0) {
        // Вычисляем центроид полигона
        let sumX = 0;
        let sumY = 0;

        ring.forEach(point => {
          sumX += point[0];
          sumY += point[1];
        });

        return [sumX / ring.length, sumY / ring.length];
      }
    }

    return null;
  }

  @boundMethod
  private handleClick() {
    mapService.clearMarkers();

    const item = this.props.feature;
    const geometry = item.geometry;

    if (item && geometry) {
      const coordinates = geometry.coordinates;
      const point = this.getPointCoordinates(coordinates);

      if (point) {
        this.drawMarker(point);
      }

      if (geometry.bbox && Array.isArray(geometry.bbox) && geometry.bbox.length >= 4) {
        this.fitToBbox(geometry.bbox, [0, 0, 0, 0], 0.85);
      } else {
        const calculatedBbox = calculateBbox(coordinates);

        if (calculatedBbox) {
          mapService.positionToExtent(calculatedBbox);
        }
      }

      const olFeatures = wfsFeaturesToOlFeatures([item]);
      mapDrawService.addFeatures(olFeatures);
    }
  }

  private fitToBbox(extent: Extent, padding: [number, number, number, number], minResolution: number) {
    mapService.fitToBbox([extent[1], extent[2], extent[0], extent[3]], padding, minResolution);
  }

  private drawMarker(pos: number[]) {
    const iconFeature = new Feature<SimpleGeometry>({
      geometry: new Point(pos)
    });

    iconFeature.setStyle(getStyle(KnownStyleKey.MapMarkerStyles));
    mapService.drawMarkers([iconFeature]);
  }
}
