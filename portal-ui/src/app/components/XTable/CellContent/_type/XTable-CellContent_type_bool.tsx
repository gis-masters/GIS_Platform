import React, { FC } from 'react';
import { Check, Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const cnXTableBoolIcon = cn('XTable', 'BoolIcon');

const XTableCellContentTypeBool: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => {
  return (
    <XTableCellContentBase col={col} {...props}>
      {['true', '1'].includes(String(cellData).toLowerCase()) ? (
        <Check className={cnXTableBoolIcon({ val: 'on' })} color='primary' fontSize='small' />
      ) : (
        <Close className={cnXTableBoolIcon({ val: 'off' })} color='disabled' fontSize='small' />
      )}
    </XTableCellContentBase>
  );
};

export const withTypeBool = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.BOOL },
  () => XTableCellContentTypeBool
);
