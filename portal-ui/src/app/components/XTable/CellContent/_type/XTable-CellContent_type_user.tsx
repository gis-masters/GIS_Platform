import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { Users } from '../../../Users/Users';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

const XTableCellContentTypeUser: FC<XTableCellContentProps<unknown>> = ({ col, cellData, ...props }) => {
  let value: MinimizedCrgUser[] = [];

  try {
    if (typeof cellData === 'string') {
      value = JSON.parse(cellData) as MinimizedCrgUser[];
    }
  } catch {
    value = [];
  }

  return (
    <XTableCellContentBase col={col} {...props}>
      <Users value={value} />
    </XTableCellContentBase>
  );
};

export const withTypeUser = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.USER },
  () => XTableCellContentTypeUser
);
