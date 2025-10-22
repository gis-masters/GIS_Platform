import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './CustomStyleControl-Label.scss';

const cnCustomStyleControlLabel = cn('CustomStyleControl', 'Label');

export const CustomStyleControlLabel: FC<ChildrenProps> = ({ children }) => (
  <span className={cnCustomStyleControlLabel()}>{children}:</span>
);
