import React, { type FC } from 'react';
import { Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-Destination.scss';

const cnGpkgPlacementDialogDestination = cn('GpkgPlacementDialog', 'Destination');

interface GpkgPlacementDialogDestinationProps {
  groupName: string;
}

export const GpkgPlacementDialogDestination: FC<GpkgPlacementDialogDestinationProps> = ({ groupName }) => (
  <Typography variant='body2' className={cnGpkgPlacementDialogDestination()}>
    Слои будут размещены в группе с именем{' '}
    <Typography
      component='span'
      variant='body2'
      sx={{
        color: 'text.secondary'
      }}
    >
      {groupName}
    </Typography>
    . На следующих шагах укажете назначение: набор данных для векторных и документ библиотеки для растровых слоёв.
  </Typography>
);
