import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-InnardsInner.scss';

const cnLayerInnardsInner = cn('Layer', 'InnardsInner');

interface LayerInnardsInnerProps {
  children: ReactNode;
}

export const LayerInnardsInner: FC<LayerInnardsInnerProps> = ({ children }) => (
  <div className={cnLayerInnardsInner()}>{children}</div>
);
