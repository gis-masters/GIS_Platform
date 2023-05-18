import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeChoice: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => (
  <XTableCellContentBase col={col} {...props}>
    {col.settings?.options?.find(({ value }) => String(value) === String(cellData))?.title ||
      (cellData === undefined || cellData === null ? '' : String(cellData))}
  </XTableCellContentBase>
);

export const withTypeChoice = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.CHOICE },
  () => XTableCellContentTypeChoice
);
