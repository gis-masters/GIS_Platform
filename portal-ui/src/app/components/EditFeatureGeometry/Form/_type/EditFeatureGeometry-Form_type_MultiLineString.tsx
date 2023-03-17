import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';

import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { EditFeatureGeometryFormProps, cnEditFeatureGeometryForm } from '../EditFeatureGeometry-Form';

const EditFeatureGeometryFormTypeMultiLineString: FC<EditFeatureGeometryFormProps> = ({ store, className }) => {
  const geometry = store.geometry as WfsMultiLineStringGeometry;

  return (
    <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
      <EditFeatureGeometrySuperGroup
        geometryPart={geometry.coordinates}
        minCoordsPerGroup={2}
        store={store}
        index={0}
      />
    </div>
  );
};

export const withTypeMultiLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_LINE_STRING },
  () => EditFeatureGeometryFormTypeMultiLineString
);
