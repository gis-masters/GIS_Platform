import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeFloat: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => {
  return (
    <XTableCellContentBase col={col} {...props}>
      {col.settings?.precision === 0 || col.settings?.precision
        ? Number(cellData).toFixed(col.settings.precision)
        : Number(cellData)}
    </XTableCellContentBase>
  );
};

export const withTypeFloat = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.FLOAT },
  () => XTableCellContentTypeFloat
);
