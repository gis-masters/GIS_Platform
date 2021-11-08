import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { CardContent } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoContent.scss';

const cnExplorerInfoContent = cn('Explorer', 'InfoContent');

export const ExplorerInfoContent: FC = ({ children }) => (
  <CardContent className={cnExplorerInfoContent()}>{children}</CardContent>
);
