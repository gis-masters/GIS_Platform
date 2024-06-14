import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import TextField from '@mui/material/TextField';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Feature } from 'ol';
import { SimpleGeometry } from 'ol/geom';

import { transformGeometry } from '../../../services/data/projections/projections.util';
import { CoordinateEdited, GeometryType, WfsFeature, WfsGeometry } from '../../../services/geoserver/wfs/wfs.models';
import { isDimensionValid, isGeometryValid } from '../../../services/geoserver/wfs/wfs.util';
import { mapService } from '../../../services/map/map.service';
import { wfsFeatureToFeature } from '../../../services/util/open-layers.util';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { Toast } from '../../Toast/Toast';
import { EditFeatureGeometryCoordDel } from '../CoordDel/EditFeatureGeometry-CoordDel';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Coord.scss';
import '!style-loader!css-loader!sass-loader!../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '!style-loader!css-loader!sass-loader!../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  store: EditFeatureGeometryStore;
  val: CoordinateEdited;
  withControls?: boolean;
  canBeDeleted?: boolean;
  disabled?: boolean;
  index?: number;
  active?: boolean;
  onChange(val: CoordinateEdited, i: number): void;
  onDelete?(index: number): void;
}

@observer
export class EditFeatureGeometryCoord extends Component<EditFeatureGeometryCoordProps> {
  private focusedPointMarker?: Feature<SimpleGeometry>;

  constructor(props: EditFeatureGeometryCoordProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { val, withControls, index, canBeDeleted, disabled, active } = this.props;

    // у росреестра своё понимание X и Y
    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls, active })}>
        {withControls ? <div className={cnEditFeatureGeometry('CoordNumber')}>{(index || 0) + 1}</div> : null}

        <TextField
          className={cnEditFeatureGeometry('CoordInput', { d: 'x' })}
          value={val[1]}
          error={!isDimensionValid(val[1])}
          onChange={this.handleChangeY}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          disabled={disabled}
          variant='outlined'
        />

        <TextField
          className={cnEditFeatureGeometry('CoordInput', { d: 'y' })}
          value={val[0]}
          error={!isDimensionValid(val[0])}
          onChange={this.handleChangeX}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          disabled={disabled}
          variant='outlined'
        />

        {withControls ? (
          <EditFeatureGeometryCoordDel onClick={this.handleDelete} disabled={!canBeDeleted || !!disabled} />
        ) : null}
      </div>
    );
  }

  @action.bound
  private handleChangeX(e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[0] = e.target.value;
    if (index) {
      onChange(val, index);
    }
    this.drawFocusedPointMarker();
  }

  @action.bound
  private handleChangeY(e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[1] = e.target.value;
    if (index) {
      onChange(val, index);
    }
    this.drawFocusedPointMarker();
  }

  @boundMethod
  private handleDelete() {
    const { onDelete, index } = this.props;
    if (onDelete && index) {
      onDelete(index);
    }
  }

  @boundMethod
  private handleInputFocus() {
    this.drawFocusedPointMarker();
  }

  @boundMethod
  private handleInputBlur() {
    this.clearFocusedPointMarker();
  }

  private drawFocusedPointMarker() {
    const { store, val } = this.props;

    if (store.geometryType === GeometryType.POINT) {
      return;
    }

    const markerGeometry: WfsGeometry = {
      type: GeometryType.POINT,
      coordinates: val
    };

    if (isGeometryValid(markerGeometry)) {
      if (projectionsStore.olProjection && store.currentProjection) {
        const feature: WfsFeature = {
          type: 'Feature',
          geometry: transformGeometry(markerGeometry, store.currentProjection, projectionsStore.olProjection),
          id: '',
          geometry_name: '',
          properties: {}
        };

        this.focusedPointMarker = wfsFeatureToFeature(feature);
      } else {
        Toast.error('Отсутствует проекция необходимая для изменения координат объекта');
      }

      if (this.focusedPointMarker) {
        mapService.draftSource?.addFeature(this.focusedPointMarker);
      }
    } else {
      this.clearFocusedPointMarker();
    }
  }

  private clearFocusedPointMarker() {
    try {
      if (this.focusedPointMarker) {
        mapService.draftSource?.removeFeature(this.focusedPointMarker);
      }
    } catch {
      // мы ожидаем exception в случае, если указанной фичи нет в слое либо если переменная не содержит фичи
      // в обоих этих случаях нам ничего не нужно предпринимать
    }
  }
}
