import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';
import { cnEditFeatureGeometryView, EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypePoint: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className])}>
    <EditFeatureGeometryViewGroup
      coordinates={[(store.geometry as WfsPointGeometry).coordinates]}
      isPoint
      store={store}
      index={0}
    />
  </div>
);

export const withTypePoint = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.POINT },
  () => EditFeatureGeometryViewTypePoint
);
