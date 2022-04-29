import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescTitle.scss';

const cnExplorerInfoDescTitle = cn('Explorer', 'InfoDescTitle');

interface ExplorerInfoDescTitleProps {
  children: ReactNode;
}

export const ExplorerInfoDescTitle: FC<ExplorerInfoDescTitleProps> = ({ children }) => (
  <span className={cnExplorerInfoDescTitle()}>{children}</span>
);
