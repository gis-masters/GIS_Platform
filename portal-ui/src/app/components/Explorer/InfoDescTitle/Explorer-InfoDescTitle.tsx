import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Explorer-InfoDescTitle.scss';

const cnExplorerInfoDescTitle = cn('Explorer', 'InfoDescTitle');

export const ExplorerInfoDescTitle: FC<ChildrenProps> = ({ children }) => (
  <span className={cnExplorerInfoDescTitle()}>{children}</span>
);
