import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureField-Label.scss';

const cnEditFeatureField = cn('EditFeatureField');

export const EditFeatureFieldLabel: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureField('Label')}>{children}</div>
);
