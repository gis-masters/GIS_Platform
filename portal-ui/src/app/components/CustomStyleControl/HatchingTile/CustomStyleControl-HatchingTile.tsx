import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type FillGraphicType } from '../../../services/geoserver/styles/styles.models';

import './CustomStyleControl-HatchingTile.scss';

const cnCustomStyleControlHatchingTile = cn('CustomStyleControl', 'HatchingTile');

interface CustomStyleControlHatchingTileProps {
  size?: number;
  color: string;
  strokeWidth?: number;
  type?: FillGraphicType;
}

export const CustomStyleControlHatchingTile: FC<CustomStyleControlHatchingTileProps> = ({
  size,
  strokeWidth,
  color,
  type
}) => (
  <div
    className={cnCustomStyleControlHatchingTile({ type: type || 'none' })}
    style={{
      '--CustomStyleControlHatchingTileSize': size || 0,
      '--CustomStyleControlHatchingTileStrokeWidth': strokeWidth || 0,
      '--CustomStyleControlHatchingTileColor': color
    }}
  />
);
