import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';
import { cnEditFeatureGeometryView, EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypePoint: FC<EditFeatureGeometryViewProps> = ({ className }) => (
  <div className={cnEditFeatureGeometryView(null, [className])}>
    <EditFeatureGeometryViewGroup
      coordinates={[(editFeatureStore.geometry as WfsPointGeometry).coordinates]}
      isPoint
      index={0}
    />
  </div>
);

export const withTypePoint = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.POINT },
  () => EditFeatureGeometryViewTypePoint
);
