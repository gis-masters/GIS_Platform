import React, { type FC } from 'react';
import { DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './PrintMapDialog-Content.scss';

const cnPrintMapDialogContent = cn('PrintMapDialog', 'Content');
export const PrintMapDialogContent: FC<ChildrenProps> = ({ children }) => (
  <DialogContent className={cnPrintMapDialogContent(null, ['scroll'])}>{children}</DialogContent>
);
