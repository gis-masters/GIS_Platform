import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-ColorTile.scss';

const cnCustomStyleControlColorTile = cn('CustomStyleControl', 'ColorTile');

interface CustomStyleControlColorTileProps {
  color: string;
}

export const CustomStyleControlColorTile: FC<CustomStyleControlColorTileProps> = ({ color }) => (
  <div className={cnCustomStyleControlColorTile()} style={{ '--CustomStyleControlColor': color }} />
);
