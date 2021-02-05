import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Geometry } from 'ol/geom';
import { boundMethod } from 'autobind-decorator';

import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { olProjection, transformGeometry } from '../../services/geoserver/projections.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { supportedGeometryTypes } from '../../services/geoserver/wfs.models';
import { Emitter } from '../../services/util/Emitter';

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
    openLayersService.modificationDone.on(this.modifyHandler, this);
  }

  componentWillUnmount()  {
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
  private modifyHandler(g: Geometry) {
    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;
    const { coordinates } = transformGeometry(
      // @ts-ignore
      { type: geometryType, coordinates: g.getCoordinates() },
      olProjection,
      nativeProjection
    );

    // @ts-ignore
    setGeometry({
      ...geometry,
      coordinates
    });
  }
}
