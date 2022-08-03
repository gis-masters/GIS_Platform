import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { CardContent } from '@mui/material';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoContent.scss';

const cnExplorerInfoContent = cn('Explorer', 'InfoContent');

export const ExplorerInfoContent: FC<ChildrenProps> = ({ children }) => (
  <CardContent className={cnExplorerInfoContent()}>{children}</CardContent>
);
