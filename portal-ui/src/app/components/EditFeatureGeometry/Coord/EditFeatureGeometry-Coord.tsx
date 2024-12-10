import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { OutlinedInput, Tooltip } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { booleanPointInPolygon, point } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import { Feature } from 'ol';
import { SimpleGeometry } from 'ol/geom';

import {
  DEFAULT_OL_PROJECTION,
  defaultOlProjectionCode,
  Projection
} from '../../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../../services/data/projections/projections.service';
import { transformGeometry } from '../../../services/data/projections/projections.util';
import { CoordinateEdited, GeometryType, WfsFeature, WfsGeometry } from '../../../services/geoserver/wfs/wfs.models';
import { isDimensionValid, isGeometryValid } from '../../../services/geoserver/wfs/wfs.util';
import { mapService } from '../../../services/map/map.service';
import { wfsFeatureToFeature } from '../../../services/util/open-layers.util';
import { isNumberArray } from '../../../services/util/typeGuards/isNumberArray';
import { bufferFeatureStore } from '../../../stores/BufferFeature.store';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { Toast } from '../../Toast/Toast';
import { EditFeatureGeometryCoordDel } from '../CoordDel/EditFeatureGeometry-CoordDel';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Coord.scss';
import '!style-loader!css-loader!sass-loader!../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '!style-loader!css-loader!sass-loader!../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const warningText = 'Внимание. Заданная координата может выходить за рамки имеющегося слоя';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  store: EditFeatureGeometryStore;
  val: CoordinateEdited;
  withControls?: boolean;
  canBeDeleted?: boolean;
  disabled?: boolean;
  displayIndex?: number;
  index?: number;
  active?: boolean;
  onChange(val: CoordinateEdited, i: number): void;
  onDelete?(index: number): void;
}

@observer
export class EditFeatureGeometryCoord extends Component<EditFeatureGeometryCoordProps> {
  private focusedPointMarker?: Feature<SimpleGeometry>;
  @observable private defaultProjection?: Projection;

  constructor(props: EditFeatureGeometryCoordProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const projection = await getProjectionByCode(defaultOlProjectionCode);

    if (projection) {
      this.setDefaultProjection(projection);
    }
  }

  render() {
    const { val, withControls, displayIndex, canBeDeleted, disabled, active } = this.props;

    // у росреестра своё понимание X и Y
    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls, active })}>
        {withControls ? <div className={cnEditFeatureGeometry('CoordNumber')}>{(displayIndex || 0) + 1}</div> : null}

        <OutlinedInput
          className={cnEditFeatureGeometry('CoordInput', { d: 'x' })}
          value={val[1]}
          error={!isDimensionValid(val[1])}
          color={this.warning ? 'warning' : undefined}
          endAdornment={
            this.warning ? (
              <Tooltip title={warningText}>
                <WarningAmberOutlined color='warning' />
              </Tooltip>
            ) : undefined
          }
          onChange={this.handleChangeY}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          disabled={disabled}
        />

        <OutlinedInput
          className={cnEditFeatureGeometry('CoordInput', { d: 'y' })}
          value={val[0]}
          error={!isDimensionValid(val[0])}
          color={this.warning ? 'warning' : undefined}
          endAdornment={
            this.warning ? (
              <Tooltip title={warningText}>
                <WarningAmberOutlined color='warning' />
              </Tooltip>
            ) : undefined
          }
          onChange={this.handleChangeX}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          disabled={disabled}
        />

        {withControls ? (
          <EditFeatureGeometryCoordDel onClick={this.handleDelete} disabled={!canBeDeleted || !!disabled} />
        ) : null}
      </div>
    );
  }

  @computed
  private get warning(): boolean {
    if (bufferFeatureStore.bufferFeature) {
      return false;
    }

    const {
      store: { layer, currentProjection, layerExtent },
      val
    } = this.props;

    if (!layer || !currentProjection || !layerExtent || !this.defaultProjection) {
      return false;
    }

    let cloneVal = val.map(Number);

    if (!isNumberArray(cloneVal) || cloneVal.some(item => Number.isNaN(item))) {
      //ошибку подсвечивает isDimensionValid(val)

      return false;
    }

    if (currentProjection.authSrid !== DEFAULT_OL_PROJECTION.srid && currentProjection && this.defaultProjection) {
      const geometry = transformGeometry(
        { type: GeometryType.POINT, coordinates: cloneVal },
        currentProjection,
        this.defaultProjection
      );

      if (geometry) {
        cloneVal = geometry.coordinates.map(Number);
      }
    }
    const checkPoint = point(cloneVal);
    const isPointInPolygon = booleanPointInPolygon(checkPoint, layerExtent);

    this.props.store.setGeometryWarning(!isPointInPolygon);

    return !isPointInPolygon;
  }

  @action
  private setDefaultProjection(projection: Projection): void {
    this.defaultProjection = projection;
  }

  @action.bound
  private handleChangeX(e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[0] = e.target.value;
    if (index || index === 0) {
      onChange(val, index);
    }
    this.drawFocusedPointMarker();
  }

  @action.bound
  private handleChangeY(e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[1] = e.target.value;
    if (index || index === 0) {
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
