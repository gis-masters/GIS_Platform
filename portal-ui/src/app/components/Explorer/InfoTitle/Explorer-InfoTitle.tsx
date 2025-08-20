import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoTitle.scss';

const cnExplorerInfoTitle = cn('Explorer', 'InfoTitle');

export const ExplorerInfoTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnExplorerInfoTitle()}>{children}</div>
);
