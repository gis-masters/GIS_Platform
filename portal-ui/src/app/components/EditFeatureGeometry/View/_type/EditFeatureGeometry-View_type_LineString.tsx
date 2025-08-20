import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';
import { cnEditFeatureGeometryView, EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypeLineString: FC<EditFeatureGeometryViewProps> = ({ className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    <EditFeatureGeometryViewGroup
      coordinates={(editFeatureStore.geometry as WfsLineStringGeometry).coordinates}
      index={0}
    />
  </div>
);

export const withTypeLineString = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.LINE_STRING },
  () => EditFeatureGeometryViewTypeLineString
);
