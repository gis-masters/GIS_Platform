import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-ToolbarRight.scss';

const cnLayersSidebarToolbarRight = cn('LayersSidebar', 'ToolbarRight');

export const LayersSidebarToolbarRight: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLayersSidebarToolbarRight()}>{children}</div>
);
