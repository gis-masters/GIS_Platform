import React, { type FC, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';
import { CardHelp } from '../Help/Card-Help';

import './Card-Row.scss';

type CardRowProps = ChildrenProps &
  IClassNameProps & {
    alignBlock?: boolean;
    help?: ReactNode;
  };

const cnCardRow = cn('Card', 'Row');

export const CardRow: FC<CardRowProps> = ({ className, children, alignBlock, help }) => (
  <div className={cnCardRow(alignBlock ? { type: 'block' } : null, [className])}>
    {children}
    {help && <CardHelp>{help}</CardHelp>}
  </div>
);
