import React, { type FC } from 'react';
import { TableHead } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './XTable-Head.scss';

const cnXTableHead = cn('XTable', 'Head');

export const XTableHead: FC<ChildrenProps> = ({ children }) => (
  <TableHead className={cnXTableHead()}>{children}</TableHead>
);
