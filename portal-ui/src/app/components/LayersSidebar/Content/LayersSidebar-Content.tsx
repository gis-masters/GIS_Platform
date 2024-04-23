import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Content.scss';

const cnLayersSidebarContent = cn('LayersSidebar', 'Content');

export const LayersSidebarContent: FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = props => (
  <div {...props} className={cnLayersSidebarContent(null, ['scroll'])} />
);
