import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { SimpleGeometry } from 'ol/geom';
import { boundMethod } from 'autobind-decorator';
import { Tooltip } from '@mui/material';

import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { olProjection, transformGeometry } from '../../services/geoserver/projections.service';
import { GeometryType, supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs.models';
import { mapService } from '../../services/map/map.service';
import { Emitter } from '../../services/common/Emitter';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';

import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryProjSel } from './ProjSel/EditFeatureGeometry-ProjSel';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
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
    mapService.modificationDone.on(this.modifyHandler, this);
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
          <EditFeatureGeometryProjSel store={store} />
        </EditFeatureGeometryHeader>
        <div className={cnEditFeatureGeometry('Field')}>
          Тип геометрии:
          <Tooltip title={this.getFeatureIconGeometryType(geometryType)}>
            <span>
              <FeatureIcon geometryType={geometryType} className={cnEditFeatureGeometry('Svg')} />
            </span>
          </Tooltip>
        </div>
        {!readOnly && <EditFeatureGeometryForm type={geometryType} store={store} />}
        {readOnly && <EditFeatureGeometryView type={geometryType} store={store} />}
      </div>
    );
  }

  @boundMethod
  private modifyHandler(g?: SimpleGeometry) {
    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;
    const coordinates = g
      ? transformGeometry(
          {
            type: geometryType,
            coordinates: g.getCoordinates()
          },
          olProjection,
          nativeProjection
        ).coordinates
      : geometry.coordinates;

    setGeometry({ ...geometry, coordinates } as WfsGeometry);
  }

  private getFeatureIconGeometryType(geometryType: GeometryType): string {
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
