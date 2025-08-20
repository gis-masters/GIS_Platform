import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { formatDate } from '../../../../services/util/date.util';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeDateTime: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => (
  <XTableCellContentBase col={col} {...props}>
    {typeof cellData === 'string' || typeof cellData === 'number' || cellData instanceof Date
      ? formatDate(cellData, col.settings?.format)
      : ''}
  </XTableCellContentBase>
);

export const withTypeDateTime = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.DATETIME },
  () => XTableCellContentTypeDateTime
);
