import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { TableCell, TableRow } from '@mui/material';

const cnXTableEmpty = cn('XTable', 'Empty');

interface XTableEmptyProps {
  colsCount: number;
}

export const XTableEmpty: FC<XTableEmptyProps> = ({ colsCount }) => (
  <TableRow className={cnXTableEmpty()}>
    <TableCell colSpan={colsCount}>Нет записей.</TableCell>
  </TableRow>
);
