import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { CrgLayer } from '../../services/gis/layers/layers.models';

export const cnLayerIcon = cn('LayerIcon');

export type LayerIconType = 'vector' | 'dxf' | 'tab' | 'mid' | 'shp' | 'raster' | 'group' | 'error' | 'unknown';

export interface LayerIconProps extends IClassNameProps {
  type: LayerIconType;
  layer?: CrgLayer;
  colorized?: boolean;
  expanded?: boolean;
  size?: SvgIconProps['fontSize'];
}

export const LayerIconBase: FC<LayerIconProps> = () => null;
