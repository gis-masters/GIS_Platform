import React, { type FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, type WfsPolygonGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../stores/EditFeature.store';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { cnEditFeatureGeometryForm, type EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

const EditFeatureGeometryFormTypePolygon: FC<EditFeatureGeometryFormProps> = ({ className }) => {
  const geometry = editFeatureStore.geometry as WfsPolygonGeometry;

  return (
    <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
      <EditFeatureGeometrySuperGroup
        geometryPart={geometry.coordinates}
        minCoordsPerGroup={4}
        groupsMustBeClosed
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
