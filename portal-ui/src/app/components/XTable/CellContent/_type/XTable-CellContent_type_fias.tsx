import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { isFiasValue } from '../../../../services/data/fias/fias.models';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { FiasView } from '../../../FiasView/FiasView';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeFias: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => {
  const { filterParams } = props;

  let word;

  if (filterParams && col.field) {
    word = getFieldFilterValue(filterParams, col.field);
  }

  return (
    <XTableCellContentBase col={col} {...props}>
      <TextOverflow maxLines={2}>
        <FiasView word={word} value={isFiasValue(cellData) ? cellData : undefined} />
      </TextOverflow>
    </XTableCellContentBase>
  );
};

export const withTypeFias = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.FIAS },
  () => XTableCellContentTypeFias
);
