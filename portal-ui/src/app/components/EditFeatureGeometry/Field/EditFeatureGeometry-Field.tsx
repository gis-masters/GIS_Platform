import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Field.scss';

const cnEditFeatureGeometryField = cn('EditFeatureGeometry', 'Field');

export const EditFeatureGeometryField: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryField()}>{children}</div>
);
