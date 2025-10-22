import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Card-Row.scss';

type CardRowProps = ChildrenProps &
  IClassNameProps & {
    alignBlock?: boolean;
  };

const cnCardRow = cn('Card', 'Row');

export const CardRow: FC<CardRowProps> = ({ className, children, alignBlock }) => (
  <div className={cnCardRow(alignBlock ? { type: 'block' } : null, [className])}>{children}</div>
);
