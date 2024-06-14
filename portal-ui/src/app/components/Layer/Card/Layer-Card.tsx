import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Layer-Card.scss';

const cnLayerCard = cn('Layer', 'Card');

interface LayerCardProps extends ChildrenProps {
  highlighted: boolean;
  onContextMenu(e: React.MouseEvent<HTMLDivElement>): void;
}

export const LayerCard: FC<LayerCardProps> = ({ children, onContextMenu, highlighted }) => (
  <div className={cnLayerCard({ highlighted })} onContextMenu={onContextMenu}>
    {children}
  </div>
);
