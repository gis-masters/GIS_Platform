import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { TableHead } from '@mui/material';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./XTable-Head.scss';

const cnXTableHead = cn('XTable', 'Head');

export const XTableHead: FC<ChildrenProps> = ({ children }) => (
  <TableHead className={cnXTableHead()}>{children}</TableHead>
);
