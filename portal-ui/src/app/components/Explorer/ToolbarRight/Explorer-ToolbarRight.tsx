import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Explorer-ToolbarRight.scss';

const cnExplorerToolbarRight = cn('Explorer', 'ToolbarRight');

export const ExplorerToolbarRight: FC<ChildrenProps> = ({ children }) => {
  return <div className={cnExplorerToolbarRight()}>{children}</div>;
};
