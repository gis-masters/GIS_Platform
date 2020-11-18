import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { Paper } from '@material-ui/core';

const cnXTableContainer = cn('XTable', 'Container');

export const XTableContainer: FC<IClassNameProps> = ({ className, children }) => (
  <Paper className={cnXTableContainer(null, [className, 'scroll'])} square>
    {children}
  </Paper>
);
