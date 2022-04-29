import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-ToolbarLeft.scss';

const cnLayersSidebarToolbarLeft = cn('LayersSidebar', 'ToolbarLeft');

interface LayersSidebarToolbarLeftProps {
  children: ReactNode;
}

export const LayersSidebarToolbarLeft: FC<LayersSidebarToolbarLeftProps> = ({ children }) => (
  <div className={cnLayersSidebarToolbarLeft()}>{children}</div>
);
