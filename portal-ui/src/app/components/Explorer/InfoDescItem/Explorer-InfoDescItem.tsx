import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescItem.scss';

const cnExplorerInfoDescItem = cn('Explorer', 'InfoDescItem');

interface ExplorerInfoDescItemProps extends IClassNameProps {
  multiline?: boolean;
  children: ReactNode;
}

export const ExplorerInfoDescItem: FC<ExplorerInfoDescItemProps> = ({ children, multiline, className }) => (
  <div className={cnExplorerInfoDescItem({ multiline }, [className])}>{children}</div>
);
