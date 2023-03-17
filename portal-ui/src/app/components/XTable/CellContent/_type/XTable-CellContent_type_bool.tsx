import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { Check, Close } from '@mui/icons-material';

import { PropertyType } from '../../../../services/data/schema/schema.models';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeBool: FC<XTableCellContentProps> = ({ col, cellData, ...props }) => {
  return (
    <XTableCellContentBase col={col} {...props}>
      {['true', '1'].includes(String(cellData).toLowerCase()) ? (
        <Check color='primary' fontSize='small' />
      ) : (
        <Close color='disabled' fontSize='small' />
      )}
    </XTableCellContentBase>
  );
};

export const withTypeBool = withBemMod<XTableCellContentProps, XTableCellContentProps>(
  cnXTableCellContent(),
  { type: PropertyType.BOOL },
  () => XTableCellContentTypeBool
);
