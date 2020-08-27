import React, { FC } from 'react';
import { Paper } from '@material-ui/core';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PermissionsAddDialog-Table.scss';

const cnPermissionsAddDialogTable = cn('PermissionsAddDialog', 'Table');

export const PermissionsAddDialogTable: FC<IClassNameProps> = ({ children, className }) => (
  <Paper className={cnPermissionsAddDialogTable(null, [className, 'scroll'])}>{children}</Paper>
);
