import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';
import { Fias } from '../../../../services/data/fias/fias.models';
import { FiasView } from '../../../FiasView/FiasView';

const XTableCellContentTypeFias: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => {
  return (
    <XTableCellContentBase col={col} {...props}>
      <FiasView value={cellData as Fias} />
    </XTableCellContentBase>
  );
};

export const withTypeFias = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.FIAS },
  () => XTableCellContentTypeFias
);
