import React from 'react';
import { observer } from 'mobx-react';
import GeometryType from 'ol/geom/GeometryType';
import { cn } from '@bem-react/classname';
import { compose } from '@bem-react/core';

import { SupportedGeometryType } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryForm as EditFeatureGeometryFormPresenter } from './Form/EditFeatureGeometry-Form';
import { withTypePoint } from './Form/_type/EditFeatureGeometry-Form_type_Point';
import { withTypeMultiLineString } from './Form/_type/EditFeatureGeometry-Form_type_MultiLineString';
import { withTypeMultiPolygon } from './Form/_type/EditFeatureGeometry-Form_type_MultiPolygon';
import { EditFeatureGeometryProjSel } from './ProjSel/EditFeatureGeometry-ProjSel';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';
import '!style-loader!css-loader!sass-loader!./Error/EditFeatureGeometry-Error.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
}

const supportedGeometryTypes: GeometryType[] & SupportedGeometryType[] = [
  GeometryType.POINT,
  GeometryType.MULTI_LINE_STRING,
  GeometryType.MULTI_POLYGON
];

const EditFeatureGeometryForm = compose(
  withTypePoint,
  withTypeMultiLineString,
  withTypeMultiPolygon
)(EditFeatureGeometryFormPresenter);

@observer
export class EditFeatureGeometry extends React.Component<EditFeatureGeometryProps> {
  render () {
    const { store } = this.props;

    if (!(store && store.geometry)) {
      return (
        <div className={cnEditFeatureGeometry()}>
          <div className={cnEditFeatureGeometry('Error')}>
            Отсутствует геометрия.
          </div>
        </div>
      );
    }

    const { geometry } = store;
    const geometryType = supportedGeometryTypes.includes(geometry.type) ? geometry.type : undefined;

    return (
      <div className={cnEditFeatureGeometry()}>
        <EditFeatureGeometryProjSel store={store} />
        <EditFeatureGeometryForm type={geometryType} geometry={geometry} />
      </div>
    );
  }
}
