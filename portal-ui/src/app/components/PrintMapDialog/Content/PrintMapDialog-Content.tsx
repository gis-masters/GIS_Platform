import React, { FC } from 'react';
import { DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Content.scss';

const cnPrintMapDialogContent = cn('PrintMapDialog', 'Content');
export const PrintMapDialogContent: FC<ChildrenProps> = ({ children }) => (
  <DialogContent className={cnPrintMapDialogContent(null, ['scroll'])}>{children}</DialogContent>
);
