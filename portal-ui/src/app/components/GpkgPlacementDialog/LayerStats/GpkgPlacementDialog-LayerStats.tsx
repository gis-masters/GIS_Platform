import React, { type FC } from 'react';
import { Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-LayerStats.scss';

const cnGpkgPlacementDialogLayerStats = cn('GpkgPlacementDialog', 'LayerStats');

interface GpkgPlacementDialogLayerStatsProps {
  total: number;
  importing: number;
  imported: number;
}

export const GpkgPlacementDialogLayerStats: FC<GpkgPlacementDialogLayerStatsProps> = ({
  total,
  importing,
  imported
}) => {
  const parts = [`Всего слоёв: ${total}`];

  if (importing) {
    parts.push(`импортируется: ${importing}`);
  }

  if (imported) {
    parts.push(`импортировано: ${imported}`);
  }

  return (
    <Typography
      variant='body2'
      className={cnGpkgPlacementDialogLayerStats()}
      component='span'
      sx={{
        color: 'text.secondary'
      }}
    >
      {parts.join(', ')}
    </Typography>
  );
};
