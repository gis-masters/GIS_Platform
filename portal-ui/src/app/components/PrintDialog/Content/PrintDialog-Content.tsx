import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { DialogContent } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Content.scss';

const cnPrintDialogContent = cn('PrintDialog', 'Content');

interface PrintDialogContentProps {
  children: ReactNode;
}

export const PrintDialogContent: FC<PrintDialogContentProps> = ({ children }) => (
  <DialogContent className={cnPrintDialogContent(null, ['scroll'])}>{children}</DialogContent>
);
