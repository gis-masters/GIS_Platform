import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Explorer-InfoTitle.scss';

const cnExplorerInfoTitle = cn('Explorer', 'InfoTitle');

export const ExplorerInfoTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnExplorerInfoTitle()}>{children}</div>
);
