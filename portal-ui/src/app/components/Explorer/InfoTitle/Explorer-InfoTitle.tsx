import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoTitle.scss';

const cnExplorerInfoTitle = cn('Explorer', 'InfoTitle');

interface ExplorerInfoTitleProps {
  children: ReactNode;
}

export const ExplorerInfoTitle: FC<ExplorerInfoTitleProps> = ({ children }) => (
  <div className={cnExplorerInfoTitle()}>{children}</div>
);
