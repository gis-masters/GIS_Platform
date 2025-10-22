import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { transparent } from '../../../services/geoserver/styles/styles.models';

import './CustomStyleControl-ColorTile.scss';
import '../TransparencyTile/CustomStyleControl-TransparencyTile.scss';
import '../TileDescription/CustomStyleControl-TileDescription.scss';

const cnCustomStyleControl = cn('CustomStyleControl');

interface CustomStyleControlColorTileProps {
  color: string;
}

export const CustomStyleControlColorTile: FC<CustomStyleControlColorTileProps> = ({ color }) => {
  return (
    <>
      {color === transparent ? (
        <div className={cnCustomStyleControl('TransparencyTile')}>
          <span className={cnCustomStyleControl('TileDescription')} />
          без заливки
        </div>
      ) : (
        <div className={cnCustomStyleControl('ColorTile')} style={{ '--CustomStyleControlColor': color }} />
      )}
    </>
  );
};
