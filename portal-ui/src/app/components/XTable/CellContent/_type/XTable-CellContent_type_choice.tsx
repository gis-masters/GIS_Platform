import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeChoice: FC<XTableCellContentProps> = ({ col, cellData, ...props }) => (
  <XTableCellContentBase col={col} {...props}>
    {col.settings?.options?.find(({ value }) => String(value) === String(cellData))?.title ||
      (cellData === undefined || cellData === null ? '' : String(cellData))}
  </XTableCellContentBase>
);

export const withTypeChoice = withBemMod<XTableCellContentProps, XTableCellContentProps>(
  cnXTableCellContent(),
  { type: PropertyType.CHOICE },
  () => XTableCellContentTypeChoice
);
