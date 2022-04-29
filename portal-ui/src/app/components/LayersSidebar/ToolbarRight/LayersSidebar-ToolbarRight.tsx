import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-ToolbarRight.scss';

const cnLayersSidebarToolbarRight = cn('LayersSidebar', 'ToolbarRight');

interface LayersSidebarToolbarRightProps {
  children: ReactNode;
}

export const LayersSidebarToolbarRight: FC<LayersSidebarToolbarRightProps> = ({ children }) => (
  <div className={cnLayersSidebarToolbarRight()}>{children}</div>
);
