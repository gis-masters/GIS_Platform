import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Card-RowTitle.scss';

const cnCardRowTitle = cn('Card', 'RowTitle');

export const CardRowTitle: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <span className={cnCardRowTitle(null, [className])}>{children}</span>
);
