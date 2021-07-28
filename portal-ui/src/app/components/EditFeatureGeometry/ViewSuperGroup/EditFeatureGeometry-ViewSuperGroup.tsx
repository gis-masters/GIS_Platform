import React, { FC } from 'react';
import { Coordinate } from 'ol/coordinate';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryViewGroup } from '../ViewGroup/EditFeatureGeometry-ViewGroup';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewSuperGroup.scss';

const cnEditFeatureGeometryViewSuperGroup = cn('EditFeatureGeometry', 'ViewSuperGroup');

interface EditFeatureGeometryViewSuperGroupProps {
  coordinates: Coordinate[][];
  store: EditFeatureGeometryStore;
}

export const EditFeatureGeometryViewSuperGroup: FC<EditFeatureGeometryViewSuperGroupProps> = ({
  coordinates,
  store
}) => (
  <div className={cnEditFeatureGeometryViewSuperGroup()}>
    {coordinates.map((coordinatesGroup, i) => (
      <EditFeatureGeometryViewGroup coordinates={coordinatesGroup} key={i} store={store} index={0} />
    ))}
  </div>
);
