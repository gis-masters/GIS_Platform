import React, { type BaseHTMLAttributes, forwardRef } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Card-Value.scss';

const cnCardValue = cn('Card', 'Value');

type CardValueProps = ChildrenProps & IClassNameProps & { block?: boolean } & BaseHTMLAttributes<HTMLSpanElement>;

export const CardValue = forwardRef<HTMLSpanElement & HTMLDivElement, CardValueProps>(
  ({ className, children, block, ...otherProps }, ref) => {
    return block ? (
      <Paper className={cnCardValue({ block }, ['scroll'])} ref={ref} {...otherProps} variant='outlined' square>
        {children}
      </Paper>
    ) : (
      <span className={cnCardValue()} ref={ref} {...otherProps}>
        {children}
      </span>
    );
  }
);
