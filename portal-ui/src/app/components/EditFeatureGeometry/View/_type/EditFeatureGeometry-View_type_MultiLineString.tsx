import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';

import { EditFeatureGeometryViewProps, cnEditFeatureGeometryView } from '../EditFeatureGeometry-View';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';

const EditFeatureGeometryViewTypeMultiLineString: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
    {(store.geometry as WfsMultiLineStringGeometry).coordinates.map((coordinatesGroup, i) => (
      <EditFeatureGeometryViewGroup coordinates={coordinatesGroup} key={i} index={i} store={store} />
    ))}
  </div>
);

export const withTypeMultiLineString = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.MULTI_LINE_STRING },
  () => EditFeatureGeometryViewTypeMultiLineString
);
