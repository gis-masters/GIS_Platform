import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { DialogContent } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Content.scss';

const cnPrintMapDialogContent = cn('PrintMapDialog', 'Content');

interface PrintMapDialogContentProps {
  children: ReactNode;
}

export const PrintMapDialogContent: FC<PrintMapDialogContentProps> = ({ children }) => (
  <DialogContent className={cnPrintMapDialogContent(null, ['scroll'])}>{children}</DialogContent>
);
