import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescItem.scss';

const cnExplorerInfoDescItem = cn('Explorer', 'InfoDescItem');

interface ExplorerInfoDescItemProps {
  multiline?: boolean;
}

export const ExplorerInfoDescItem: FC<ExplorerInfoDescItemProps> = ({ children, multiline }) => (
  <div className={cnExplorerInfoDescItem({ multiline })}>{children}</div>
);
