import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsPolygonGeometry } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { EditFeatureGeometryFormProps, cnEditFeatureGeometryForm } from '../EditFeatureGeometry-Form';

const EditFeatureGeometryFormTypePolygon: FC<EditFeatureGeometryFormProps> = ({ store, className }) => {
  const geometry = store.geometry as WfsPolygonGeometry;

  return (
    <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
      <EditFeatureGeometrySuperGroup
        geometryPart={geometry.coordinates}
        minCoordsPerGroup={4}
        groupsMustBeClosed
        store={store}
        index={0}
      />
    </div>
  );
};

export const withTypePolygon = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.POLYGON },
  () => EditFeatureGeometryFormTypePolygon
);
