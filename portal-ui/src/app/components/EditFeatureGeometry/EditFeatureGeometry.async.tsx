import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { SimpleGeometry } from 'ol/geom';

import { Emitter } from '../../services/common/Emitter';
import { Projection } from '../../services/data/projection/projection.models';
import { getOlProjection } from '../../services/data/projection/projection.service';
import { transformGeometry } from '../../services/data/projection/projection.util';
import { GeometryType, supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { mapService } from '../../services/map/map.service';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { Toast } from '../Toast/Toast';
import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
  readOnly: boolean;
}

@observer
export default class EditFeatureGeometry extends Component<EditFeatureGeometryProps> {
  @observable private olProjection?: Projection;

  constructor(props: EditFeatureGeometryProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    // TODO: хз что за ошибка тут с типами
    mapService.modificationDone.on(this.modifyHandler, this);

    const olProjection = await getOlProjection();
    if (olProjection) {
      this.setOlProjection(olProjection);
    }
  }

  componentWillUnmount() {
    Emitter.scopeOff(this);
  }

  render() {
    const { store, readOnly } = this.props;

    if (!(store && store.geometry)) {
      return (
        <div className={cnEditFeatureGeometry()}>
          <EditFeatureGeometryError>Отсутствует геометрия.</EditFeatureGeometryError>
        </div>
      );
    }

    const { geometry } = store;
    const geometryType = supportedGeometryTypes.includes(geometry?.type) ? geometry.type : undefined;

    return (
      <div className={cnEditFeatureGeometry()}>
        <EditFeatureGeometryHeader>
          <SelectProjection
            onSelect={this.setSelectedCrs}
            defaultProjection={store.currentProjection}
            formView
            fullWidth
          />
        </EditFeatureGeometryHeader>
        {geometryType && (
          <div className={cnEditFeatureGeometry('Field')}>
            Тип геометрии:
            <Tooltip title={this.getFeatureIconGeometryType(geometryType)}>
              <span>
                <FeatureIcon geometryType={geometryType} className={cnEditFeatureGeometry('Svg')} />
              </span>
            </Tooltip>
          </div>
        )}
        {geometryType && !readOnly && <EditFeatureGeometryForm type={geometryType} store={store} />}
        {geometryType && readOnly && <EditFeatureGeometryView type={geometryType} store={store} />}
      </div>
    );
  }

  @boundMethod
  private modifyHandler(e: CustomEvent<SimpleGeometry | undefined>) {
    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;
    if (!this.olProjection) {
      Toast.warn('Отсутствует проекция необходимая для изменения геометрии объекта');

      return;
    }

    const coordinates = e.detail
      ? transformGeometry(
          {
            type: geometryType,
            coordinates: e.detail.getCoordinates() || []
          },
          this.olProjection,
          nativeProjection
        )?.coordinates
      : geometry?.coordinates;

    setGeometry({ ...geometry, coordinates } as WfsGeometry);
  }

  @boundMethod
  private setSelectedCrs(proj: Projection) {
    this.props.store.setProjection(proj);
  }

  private getFeatureIconGeometryType(geometryType: GeometryType): string | undefined {
    if (!geometryType) {
      return;
    }

    switch (geometryType) {
      case GeometryType.POLYGON: {
        return 'полигон';
      }
      case GeometryType.MULTI_POLYGON: {
        return 'мультиполигон';
      }
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING: {
        return 'линия';
      }
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        return 'точка';
      }
    }
  }

  @action.bound
  private setOlProjection(olProj: Projection) {
    this.olProjection = olProj;
  }
}
