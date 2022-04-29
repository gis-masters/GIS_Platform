import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { CardContent } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoContent.scss';

const cnExplorerInfoContent = cn('Explorer', 'InfoContent');

interface ExplorerInfoContentProps {
  children: ReactNode;
}

export const ExplorerInfoContent: FC<ExplorerInfoContentProps> = ({ children }) => (
  <CardContent className={cnExplorerInfoContent()}>{children}</CardContent>
);
