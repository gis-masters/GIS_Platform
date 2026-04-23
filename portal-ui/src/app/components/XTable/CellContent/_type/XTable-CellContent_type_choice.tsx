import React, { type FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';
import { cnXTableCellContent, XTableCellContentBase, type XTableCellContentProps } from '../XTable-CellContent.base';

function choiceCellDataFallback(cellData: unknown): string {
  if (cellData === undefined || cellData === null) {
    return '';
  }
  if (typeof cellData === 'string' || typeof cellData === 'number' || typeof cellData === 'boolean') {
    return String(cellData);
  }

  return '';
}

const XTableCellContentTypeChoice: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => (
  <XTableCellContentBase col={col} {...props}>
    <TextOverflow maxLines={2}>
      {col.settings?.options?.find(({ value }) => String(value) === String(cellData))?.title ||
        choiceCellDataFallback(cellData)}
    </TextOverflow>
  </XTableCellContentBase>
);

export const withTypeChoice = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.CHOICE },
  () => XTableCellContentTypeChoice
);
