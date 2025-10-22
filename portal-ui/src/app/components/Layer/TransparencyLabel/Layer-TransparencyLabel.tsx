import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './Layer-TransparencyLabel.scss';

const cnLayerTransparencyLabel = cn('Layer', 'TransparencyLabel');

interface LayerTransparencyLabelProps {
  value: number;
}

export const LayerTransparencyLabel: FC<LayerTransparencyLabelProps> = ({ value }) => (
  <div className={cnLayerTransparencyLabel()}>{value}%</div>
);
