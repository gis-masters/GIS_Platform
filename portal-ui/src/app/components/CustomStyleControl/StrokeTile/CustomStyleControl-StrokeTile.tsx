import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { chunk } from 'lodash';

import { CustomStyleControlDash } from '../Dash/CustomStyleControl-Dash';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-StrokeTile.scss';

const cnCustomStyleControlStrokeTile = cn('CustomStyleControl', 'StrokeTile');

interface CustomStyleControlStrokeTileProps {
  strokeWidth: number;
  strokeDasharray?: number[];
}

const STROKE_TILE_SIZE = 55;

export const CustomStyleControlStrokeTile: FC<CustomStyleControlStrokeTileProps> = ({
  strokeWidth,
  strokeDasharray = [STROKE_TILE_SIZE]
}) => {
  const displayedInTileDashArray: number[] = [];
  let summaryLength = 0;
  let i = 0;

  do {
    summaryLength += strokeDasharray[i % strokeDasharray.length];
    displayedInTileDashArray.push(strokeDasharray[i % strokeDasharray.length]);
    i++;
  } while (summaryLength < STROKE_TILE_SIZE);

  return (
    <div
      className={cnCustomStyleControlStrokeTile()}
      style={{ '--CustomStyleControlStrokeWidth': strokeWidth, '--CustomStyleControlStrokeTileSize': STROKE_TILE_SIZE }}
    >
      {chunk(displayedInTileDashArray, 2).map(([length, gap], i) => (
        <CustomStyleControlDash length={length} nextGap={gap} key={i} />
      ))}
    </div>
  );
};
