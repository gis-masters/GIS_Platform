import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Card.scss';

const cnLayerCard = cn('Layer', 'Card');

interface LayerCardProps {
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  highlighted: boolean;
  children: ReactNode;
}

export const LayerCard: FC<LayerCardProps> = ({ children, onContextMenu, highlighted }) => (
  <div className={cnLayerCard({ highlighted })} onContextMenu={onContextMenu}>
    {children}
  </div>
);
