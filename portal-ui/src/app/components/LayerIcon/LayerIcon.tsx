import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

export const cnLayerIcon = cn('LayerIcon');

export type LayerIconType = 'vector' | 'raster' | 'group' | 'error' | 'unknown';

export interface LayerIconProps extends IClassNameProps {
  type: LayerIconType;
  colorized?: boolean;
}

export const LayerIcon: FC<LayerIconProps> = () => null;
