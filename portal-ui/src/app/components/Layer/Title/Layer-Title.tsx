import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Title.scss';

const cnLayerTitle = cn('Layer', 'Title');

interface LayerTitleProps {
  isError: boolean;
  children: ReactNode;
}

export const LayerTitle: FC<LayerTitleProps> = ({ children, isError }) => (
  <div className={cnLayerTitle({ error: isError })}>{children}</div>
);
