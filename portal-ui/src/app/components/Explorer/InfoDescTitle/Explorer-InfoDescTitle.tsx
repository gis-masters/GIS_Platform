import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescTitle.scss';

const cnExplorerInfoDescTitle = cn('Explorer', 'InfoDescTitle');

export const ExplorerInfoDescTitle: FC<ChildrenProps> = ({ children }) => (
  <span className={cnExplorerInfoDescTitle()}>{children}</span>
);
