import React, { FC } from 'react';
import GeometryType from 'ol/geom/GeometryType';
import { withBemMod } from '@bem-react/core';

import { WfsPointGeometry } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryViewProps, cnEditFeatureGeometryView } from '../EditFeatureGeometry-View';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';

const EditFeatureGeometryViewTypePoint: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className])}>
    <EditFeatureGeometryViewGroup coordinates={[(store.geometry as WfsPointGeometry).coordinates]} isPoint={true} />
  </div>
);

export const withTypePoint = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.POINT },
  () => props => <EditFeatureGeometryViewTypePoint {...props} />
);
