import React, { type FC } from 'react';
import { CardContent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Explorer-InfoContent.scss';

const cnExplorerInfoContent = cn('Explorer', 'InfoContent');

export const ExplorerInfoContent: FC<ChildrenProps> = ({ children }) => (
  <CardContent className={cnExplorerInfoContent()}>{children}</CardContent>
);
