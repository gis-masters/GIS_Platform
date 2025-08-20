import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';
import { cnEditFeatureGeometryView, EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypeMultiPoint: FC<EditFeatureGeometryViewProps> = ({ className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    <EditFeatureGeometryViewGroup
      coordinates={(editFeatureStore.geometry as WfsMultiPointGeometry).coordinates}
      index={0}
    />
  </div>
);

export const withTypeMultiPoint = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.MULTI_POINT },
  () => EditFeatureGeometryViewTypeMultiPoint
);
