import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type Projection } from '../../../services/data/projections/projections.models';
import { SelectProjection } from '../../SelectProjection/SelectProjection';

import './EditFeatureGeometry-SelectProjection.scss';

const cnEditFeatureGeometrySelectProjection = cn('EditFeatureGeometry', 'SelectProjection');

interface EditFeatureGeometrySelectProjectionProps {
  value: Projection;
  onChange(value: Projection): void;
}

export const EditFeatureGeometrySelectProjection: FC<EditFeatureGeometrySelectProjectionProps> = ({
  value,
  onChange
}) => (
  <SelectProjection
    className={cnEditFeatureGeometrySelectProjection()}
    fullWidth
    value={value}
    onChange={onChange}
    htmlId='EditFeatureGeometrySelectProjection'
  />
);
