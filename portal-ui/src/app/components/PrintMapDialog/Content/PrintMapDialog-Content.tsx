import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { DialogContent } from '@mui/material';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Content.scss';

const cnPrintMapDialogContent = cn('PrintMapDialog', 'Content');
export const PrintMapDialogContent: FC<ChildrenProps> = ({ children }) => (
  <DialogContent className={cnPrintMapDialogContent(null, ['scroll'])}>{children}</DialogContent>
);
