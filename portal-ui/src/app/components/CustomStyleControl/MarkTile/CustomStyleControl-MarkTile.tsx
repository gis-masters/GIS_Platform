import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PointRule } from '../../../services/geoserver/styles/styles.models';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-MarkTile.scss';

const cnCustomStyleControlMarkTile = cn('CustomStyleControl', 'MarkTile');

interface CustomStyleControlMarkTileProps {
  size: number;
  color: string;
  type: PointRule['markType'];
}

export const CustomStyleControlMarkTile: FC<CustomStyleControlMarkTileProps> = ({ size, type, color }) => (
  <div
    className={cnCustomStyleControlMarkTile({ type })}
    style={{ '--CustomStyleControlMarkTileSize': size, '--CustomStyleControlMarkTileColor': color }}
  />
);
