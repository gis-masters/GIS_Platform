import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { SimpleGeometry } from 'ol/geom';

import { Emitter } from '../../services/common/Emitter';
import { Epsg } from '../../services/data/epsg/epsg.models';
import { getOlEpsg } from '../../services/data/epsg/epsg.service';
import { transformGeometry } from '../../services/data/epsg/epsg.util';
import { GeometryType, supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { mapService } from '../../services/map/map.service';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { SelectEpsg } from '../SelectEpsg/SelectEpsg';
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
  @observable private olEpsg?: Epsg;

  constructor(props: EditFeatureGeometryProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    // TODO: хз что за ошибка тут с типами
    mapService.modificationDone.on(this.modifyHandler, this);

    const olEpsg = await getOlEpsg();

    if (olEpsg) {
      this.setOlEpsg(olEpsg);
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
          <SelectEpsg onSelect={this.setSelectedCrs} defaultEpsg={store.currentEpsg} formView fullWidth />
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
    const { nativeEpsg, geometry, geometryType, setGeometry } = this.props.store;
    if (!this.olEpsg) {
      Toast.warn('Отсутствует проекция необходимая для изменения геометрии объекта');

      return;
    }

    const coordinates = e.detail
      ? transformGeometry(
        {
          type: geometryType,
          coordinates: e.detail.getCoordinates() || []
        },
        this.olEpsg,
        nativeEpsg
      )?.coordinates
      : geometry?.coordinates;

    setGeometry({ ...geometry, coordinates } as WfsGeometry);
  }

  @boundMethod
  private setSelectedCrs(epsg: Epsg) {
    this.props.store.setEpsg(epsg);
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
  private setOlEpsg(olEpsg: Epsg) {
    this.olEpsg = olEpsg;
  }
}
