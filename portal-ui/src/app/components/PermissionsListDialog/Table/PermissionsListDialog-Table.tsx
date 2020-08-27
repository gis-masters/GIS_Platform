import React, { FC } from 'react';
import { Paper } from '@material-ui/core';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-Table.scss';

const cnPermissionsListDialogTable = cn('PermissionsListDialog', 'Table');

export const PermissionsListDialogTable: FC<IClassNameProps> = ({ children, className }) => (
  <Paper className={cnPermissionsListDialogTable(null, [className, 'scroll'])}>{children}</Paper>
);
