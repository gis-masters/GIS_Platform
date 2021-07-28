import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { SimpleGeometry } from 'ol/geom';
import { boundMethod } from 'autobind-decorator';

import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { olProjection, transformGeometry } from '../../services/geoserver/projections.service';
import { mapService } from '../../services/map/map.service';
import { supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs.models';
import { Emitter } from '../../services/common/Emitter';

import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryProjSel } from './ProjSel/EditFeatureGeometry-ProjSel';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
  readOnly: boolean;
}

@observer
export class EditFeatureGeometry extends Component<EditFeatureGeometryProps> {
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
        {!readOnly && <EditFeatureGeometryForm type={geometryType} store={store} />}
        {readOnly && <EditFeatureGeometryView type={geometryType} store={store} />}
      </div>
    );
  }

  @boundMethod
  private modifyHandler(g: SimpleGeometry) {
    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;
    const { coordinates } = transformGeometry(
      {
        type: geometryType,
        coordinates: g.getCoordinates()
      },
      olProjection,
      nativeProjection
    );

    setGeometry({ ...geometry, coordinates } as WfsGeometry);
  }
}
