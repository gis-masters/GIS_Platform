import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';
import { FiasView } from '../../../FiasView/FiasView';
import { Fias } from '../../../../services/data/fias.service';

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
