import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-ToolbarLeft.scss';

const cnLayersSidebarToolbarLeft = cn('LayersSidebar', 'ToolbarLeft');

export const LayersSidebarToolbarLeft: FC = ({ children }) => (
  <div className={cnLayersSidebarToolbarLeft()}>{children}</div>
);
