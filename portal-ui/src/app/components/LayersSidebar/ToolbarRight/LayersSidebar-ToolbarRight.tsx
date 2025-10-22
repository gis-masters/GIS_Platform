import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './LayersSidebar-ToolbarRight.scss';

const cnLayersSidebarToolbarRight = cn('LayersSidebar', 'ToolbarRight');

export const LayersSidebarToolbarRight: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLayersSidebarToolbarRight()}>{children}</div>
);
