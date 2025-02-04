import React, { BaseHTMLAttributes, forwardRef } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Card-Value.scss';

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
