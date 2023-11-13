import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-Label.scss';

const cnCustomStyleControlLabel = cn('CustomStyleControl', 'Label');

export const CustomStyleControlLabel: FC<ChildrenProps> = ({ children }) => (
  <span className={cnCustomStyleControlLabel()}>{children}:</span>
);
