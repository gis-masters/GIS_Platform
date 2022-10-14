import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsLineStringGeometry } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryViewProps, cnEditFeatureGeometryView } from '../EditFeatureGeometry-View';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';

const EditFeatureGeometryViewTypeLineString: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    <EditFeatureGeometryViewGroup
      coordinates={(store.geometry as WfsLineStringGeometry).coordinates}
      store={store}
      index={0}
    />
  </div>
);

export const withTypeLineString = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.LINE_STRING },
  () => EditFeatureGeometryViewTypeLineString
);
