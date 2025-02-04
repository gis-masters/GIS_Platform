import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Gap.scss';

const cnLayer = cn('Layer');

interface LayerGapProps {
  gap: number;
}

export const LayerGap: FC<LayerGapProps> = ({ gap }) => (
  <div className={cnLayer('Gap')} style={{ '--layer-gap': gap }} />
);
