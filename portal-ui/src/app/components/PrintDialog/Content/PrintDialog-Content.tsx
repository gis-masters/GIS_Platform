import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { DialogContent } from '@material-ui/core';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Content.scss';

const cnPrintDialogContent = cn('PrintDialog', 'Content');

export const PrintDialogContent: FC = ({ children }) => (
  <DialogContent className={cnPrintDialogContent(null, ['scroll'])}>{children}</DialogContent>
);
