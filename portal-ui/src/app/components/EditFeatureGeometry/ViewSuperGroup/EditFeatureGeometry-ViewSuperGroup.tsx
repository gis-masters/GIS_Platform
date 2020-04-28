import React, { FC } from 'react';
import { Coordinate } from 'ol/coordinate';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryViewGroup } from '../ViewGroup/EditFeatureGeometry-ViewGroup';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewSuperGroup.scss';

const cnEditFeatureGeometryViewSuperGroup = cn('EditFeatureGeometry', 'ViewSuperGroup');

interface EditFeatureGeometryViewSuperGroupProps {
  coordinates: Coordinate[][];
}

export const EditFeatureGeometryViewSuperGroup: FC<EditFeatureGeometryViewSuperGroupProps> = ({ coordinates }) => (
  <div className={cnEditFeatureGeometryViewSuperGroup()}>
    {coordinates.map((coordinatesGroup, i) => (
      <EditFeatureGeometryViewGroup coordinates={coordinatesGroup} key={i} />
    ))}
  </div>
);
