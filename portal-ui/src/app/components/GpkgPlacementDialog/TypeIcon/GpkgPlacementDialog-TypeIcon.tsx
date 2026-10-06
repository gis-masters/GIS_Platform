import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { Layers as LayersIcon, Texture } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-TypeIcon.scss';

const cnGpkgPlacementDialogTypeIcon = cn('GpkgPlacementDialog', 'TypeIcon');

interface GpkgPlacementDialogTypeIconProps {
  type: 'vector' | 'raster';
}

export const GpkgPlacementDialogTypeIcon: FC<GpkgPlacementDialogTypeIconProps> = ({ type }) => {
  const raster = type === 'raster';
  const Icon = raster ? Texture : LayersIcon;
  const title = raster ? 'Растровый слой' : 'Векторный слой';

  return (
    <Tooltip arrow placement='top' title={title}>
      <Icon className={cnGpkgPlacementDialogTypeIcon()} color='action' fontSize='small' />
    </Tooltip>
  );
};
