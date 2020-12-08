import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Content.scss';

const cnLayersSidebarContent = cn('LayersSidebar', 'Content');

export const LayersSidebarContent: FC = ({ children }) => (
  <div className={cnLayersSidebarContent(null, ['scroll'])}>{children}</div>
);
