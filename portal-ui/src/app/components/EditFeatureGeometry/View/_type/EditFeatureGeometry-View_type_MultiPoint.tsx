import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';

import { EditFeatureGeometryViewProps, cnEditFeatureGeometryView } from '../EditFeatureGeometry-View';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';

const EditFeatureGeometryViewTypeMultiPoint: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    <EditFeatureGeometryViewGroup
      coordinates={(store.geometry as WfsMultiPointGeometry).coordinates}
      store={store}
      index={0}
    />
  </div>
);

export const withTypeMultiPoint = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.MULTI_POINT },
  () => EditFeatureGeometryViewTypeMultiPoint
);
