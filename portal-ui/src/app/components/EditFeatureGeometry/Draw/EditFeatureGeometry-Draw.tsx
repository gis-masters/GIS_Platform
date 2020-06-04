import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Coordinate } from 'ol/coordinate';
import { DrawEvent } from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { IconButton, Tooltip } from '@material-ui/core';
import { Brush } from '@material-ui/icons';
import { cn } from '@bem-react/classname';

import { openLayersService } from '../../../services/open-layer/open-layers.service';
import { CoordinateEdited } from '../../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { transform, olProjection } from '../../../services/geoserver/projections.service';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometryDraw');

interface EditFeatureGeometryDrawProps {
  coordinates: CoordinateEdited[];
  store: EditFeatureGeometryStore;
}

@observer
export class EditFeatureGeometryDraw extends Component<EditFeatureGeometryDrawProps> {
  @observable private active = false;

  componentWillUnmount () {
    if (this.active) {
      document.body.classList.remove('global-crosshair-cursor');
      openLayersService.drawOff();
    }
  }

  constructor (props: EditFeatureGeometryDrawProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
    this.handleDraw = this.handleDraw.bind(this);
  }

  render () {
    return (
      <Tooltip title="Нарисовать на карте">
        <IconButton
            className={cnEditFeatureGeometryDraw()}
            onClick={this.clickHandler}
            color={this.active ? 'secondary' : 'default'}
        >
          <Brush />
        </IconButton>
      </Tooltip>
    );
  }

  private get geometryType (): GeometryType {
    const { geometryType } = this.props.store;

    return geometryType === GeometryType.MULTI_POLYGON ? GeometryType.POLYGON : geometryType;
  }

  private handleDraw (e: DrawEvent) {
    // @ts-ignore
    const drawed = e.feature.getGeometry().getCoordinates() as Coordinate[][];
    const newCoordinates = drawed[0].map(coord => transform(olProjection, this.props.store.currentProjection, coord));

    this.updateGeometry(newCoordinates);
  }

  @action
  private updateGeometry (newCoordinates: CoordinateEdited[]) {
    const { coordinates } = this.props;
    coordinates.splice(0, coordinates.length, ...newCoordinates);
  }

  @action
  private clickHandler () {
    this.active = !this.active;
    if (this.active) {
      document.body.classList.add('global-crosshair-cursor');
      openLayersService.draw(this.geometryType, this.handleDraw);
    } else {
      document.body.classList.remove('global-crosshair-cursor');
      openLayersService.drawOff();
    }
  }
}
