import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-ToolbarLeft.scss';

const cnLayersSidebarToolbarLeft = cn('LayersSidebar', 'ToolbarLeft');
export const LayersSidebarToolbarLeft: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLayersSidebarToolbarLeft()}>{children}</div>
);
