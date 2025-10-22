import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './LayersSidebar-Inner.scss';

const cnLayersSidebarInner = cn('LayersSidebar', 'Inner');
export const LayersSidebarInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLayersSidebarInner()}>{children}</div>
);
