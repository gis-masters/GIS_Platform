import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { TableCell, TableRow } from '@mui/material';

const cnXTableEmpty = cn('XTable', 'Empty');

interface XTableEmptyProps {
  colsCount: number;
  busy: boolean;
}

export const XTableEmpty: FC<XTableEmptyProps> = ({ colsCount, busy }) => (
  <TableRow className={cnXTableEmpty()}>
    <TableCell colSpan={colsCount}>{busy ? 'Загрузка...' : 'Нет записей.'}</TableCell>
  </TableRow>
);
