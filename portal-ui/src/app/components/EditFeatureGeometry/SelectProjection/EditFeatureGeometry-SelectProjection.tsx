import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Projection } from '../../../services/data/projections/projections.models';
import { SelectProjection } from '../../SelectProjection/SelectProjection';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-SelectProjection.scss';

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
