import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Inner.scss';

const cnLayersSidebarInner = cn('LayersSidebar', 'Inner');

interface LayersSidebarInnerProps {
  children: ReactNode;
}

export const LayersSidebarInner: FC<LayersSidebarInnerProps> = ({ children }) => (
  <div className={cnLayersSidebarInner()}>{children}</div>
);
