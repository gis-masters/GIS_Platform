import React, { type FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, type WfsPolygonGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../stores/EditFeature.store';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';
import { cnEditFeatureGeometryView, type EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypePolygon: FC<EditFeatureGeometryViewProps> = ({ className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    {(editFeatureStore.geometry as WfsPolygonGeometry).coordinates.map((coordinatesGroup, i) => (
      <EditFeatureGeometryViewGroup coordinates={coordinatesGroup} key={i} index={i} />
    ))}
  </div>
);

export const withTypePolygon = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.POLYGON },
  () => EditFeatureGeometryViewTypePolygon
);
