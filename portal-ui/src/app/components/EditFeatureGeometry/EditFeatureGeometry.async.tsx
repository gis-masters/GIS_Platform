import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Geometry, SimpleGeometry } from 'ol/geom';

import { Emitter } from '../../services/common/Emitter';
import { transformGeometry } from '../../services/data/projections/projections.util';
import { GeometryType, supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { mapService } from '../../services/map/map.service';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { projectionsStore } from '../../stores/Projections.store';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryField } from './Field/EditFeatureGeometry-Field';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometrySelectProjection } from './SelectProjection/EditFeatureGeometry-SelectProjection';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
  readOnly: boolean;
}

@observer
export default class EditFeatureGeometry extends Component<EditFeatureGeometryProps> {
  componentDidMount() {
    mapService.modificationDone.on(this.handleModify, this);
  }

  componentWillUnmount() {
    Emitter.scopeOff(this);
  }

  render() {
    const { store, readOnly } = this.props;

    if (!(store && store.geometry && store.currentProjection)) {
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
          <EditFeatureGeometryField>
            Система координат:
            <EditFeatureGeometrySelectProjection value={store.currentProjection} onChange={store.setProjection} />
          </EditFeatureGeometryField>
        </EditFeatureGeometryHeader>
        {geometryType && (
          <EditFeatureGeometryField>
            Тип геометрии:
            <Tooltip title={this.getFeatureIconGeometryType(geometryType)}>
              <span>
                <FeatureIcon geometryType={geometryType} className={cnEditFeatureGeometry('Svg')} />
              </span>
            </Tooltip>
          </EditFeatureGeometryField>
        )}
        {geometryType && !readOnly && <EditFeatureGeometryForm type={geometryType} store={store} />}
        {geometryType && readOnly && <EditFeatureGeometryView type={geometryType} store={store} />}
      </div>
    );
  }

  @boundMethod
  private handleModify(e: CustomEvent<Geometry>) {
    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;

    if (!geometryType || !projectionsStore.olProjection || !nativeProjection) {
      throw new Error('Не удалось изменить геометрию');
    }

    const coordinates =
      e.detail instanceof SimpleGeometry
        ? transformGeometry(
            {
              type: geometryType,
              coordinates: e.detail.getCoordinates() || []
            },
            projectionsStore.olProjection,
            nativeProjection
          )?.coordinates
        : geometry?.coordinates;

    setGeometry({ ...geometry, coordinates } as WfsGeometry);
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
}
