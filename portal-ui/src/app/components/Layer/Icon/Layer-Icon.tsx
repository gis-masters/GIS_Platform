import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { SupportedGeometryType } from '../../../services/geoserver/wfs-models';

import '!style-loader!css-loader!sass-loader!./Layer-Icon.scss';

export const cnLayerIcon = cn('Layer', 'Icon');

export type IconType = SupportedGeometryType | 'group' | 'unknown' | 'raster' | 'error';

export interface LayerIconProps extends IClassNameProps {
  type: IconType;
}

export const LayerIcon: FC<LayerIconProps> = () => null;
