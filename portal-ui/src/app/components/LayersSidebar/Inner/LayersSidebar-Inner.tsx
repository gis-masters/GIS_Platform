import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Inner.scss';

const cnLayersSidebarInner = cn('LayersSidebar', 'Inner');

export const LayersSidebarInner: FC = ({ children }) => <div className={cnLayersSidebarInner()}>{children}</div>;
