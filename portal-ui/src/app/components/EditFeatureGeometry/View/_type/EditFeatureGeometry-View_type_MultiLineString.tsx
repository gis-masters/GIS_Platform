import React, { FC } from 'react';
import GeometryType from 'ol/geom/GeometryType';
import { withBemMod } from '@bem-react/core';

import { WfsMultiLineStringGeometry } from '../../../../services/geoserver/wfs.models';

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
  () => props => <EditFeatureGeometryViewTypeMultiLineString {...props} />
);
