import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';
import { Fias } from '../../../../services/data/fias/fias.models';
import { FiasView } from '../../../FiasView/FiasView';

const XTableCellContentTypeFias: FC<XTableCellContentProps> = ({ col, cellData, ...props }) => {
  return (
    <XTableCellContentBase col={col} {...props}>
      <FiasView value={cellData as Fias} />
    </XTableCellContentBase>
  );
};

export const withTypeFias = withBemMod<XTableCellContentProps, XTableCellContentProps>(
  cnXTableCellContent(),
  { type: PropertyType.FIAS },
  () => XTableCellContentTypeFias
);
