import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiPolygonGeometry } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryViewProps, cnEditFeatureGeometryView } from '../EditFeatureGeometry-View';
import { EditFeatureGeometryViewSuperGroup } from '../../ViewSuperGroup/EditFeatureGeometry-ViewSuperGroup';

const EditFeatureGeometryViewTypeMultiPolygon: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    {(store.geometry as WfsMultiPolygonGeometry).coordinates.map((coordinatesGroup, i) => (
      <EditFeatureGeometryViewSuperGroup coordinates={coordinatesGroup} key={i} store={store} />
    ))}
  </div>
);

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.MULTI_POLYGON },
  () => EditFeatureGeometryViewTypeMultiPolygon
);
