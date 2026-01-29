import React, { type FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { isNumber } from 'lodash';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { cnXTableCellContent, XTableCellContentBase, type XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeFloat: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => {
  let value: number | string | undefined = cellData === null || cellData === '' ? undefined : Number(cellData);

  if (value === undefined || Number.isNaN(value)) {
    value = '';
  }

  if (isNumber(value) && (col.settings?.precision === 0 || col.settings?.precision)) {
    value = value.toFixed(col.settings.precision);
  }

  return (
    <XTableCellContentBase col={col} {...props}>
      {value}
    </XTableCellContentBase>
  );
};

export const withTypeFloat = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.FLOAT },
  () => XTableCellContentTypeFloat
);
