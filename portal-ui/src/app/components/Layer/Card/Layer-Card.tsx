import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Card.scss';

const cnLayer = cn('Layer');

interface LayerCardProps {
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const LayerCard: FC<LayerCardProps> = ({ children, onContextMenu }) => (
  <div className={cnLayer('Card')} onContextMenu={onContextMenu}>
    {children}
  </div>
);
