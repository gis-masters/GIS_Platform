import React, { type CSSProperties, type FC } from 'react';
import { cn } from '@bem-react/classname';

import './Layer-TransparencyIndicator.scss';

const cnLayerTransparencyIndicator = cn('Layer', 'TransparencyIndicator');

interface LayerTransparencyIndicatorProps {
  value: number;
}

export const LayerTransparencyIndicator: FC<LayerTransparencyIndicatorProps> = ({ value }) => (
  <div className={cnLayerTransparencyIndicator()} style={{ '--LayerTransparencyValue': value } as CSSProperties} />
);
