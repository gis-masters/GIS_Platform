import React, { FC } from 'react';
import { observer } from 'mobx-react';
import GeometryType from 'ol/geom/GeometryType';
import { cn } from '@bem-react/classname';

import { SupportedGeometryType } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
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

export const EditFeatureGeometry = observer<FC<EditFeatureGeometryProps>>(({ store }) => {
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
      <EditFeatureGeometryForm type={geometryType} store={store} />
    </div>
  );
});
