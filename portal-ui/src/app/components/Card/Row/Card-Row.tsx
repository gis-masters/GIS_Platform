import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Card-Row.scss';

type CardRowProps = ChildrenProps &
  IClassNameProps & {
    alignBlock?: boolean;
  };

const cnCardRow = cn('Card', 'Row');

export const CardRow: FC<CardRowProps> = ({ className, children, alignBlock }) => (
  <div className={cnCardRow(alignBlock ? { type: 'block' } : null, [className])}>{children}</div>
);
