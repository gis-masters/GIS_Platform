import React, { type FC } from 'react';
import { Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-FileHint.scss';

const cnGpkgPlacementDialogFileHint = cn('GpkgPlacementDialog', 'FileHint');

interface GpkgPlacementDialogFileHintProps {
  fileName?: string;
}

export const GpkgPlacementDialogFileHint: FC<GpkgPlacementDialogFileHintProps> = ({ fileName }) =>
  fileName ? (
    <Typography
      variant='body2'
      className={cnGpkgPlacementDialogFileHint()}
      component='span'
      sx={{
        color: 'text.secondary'
      }}
    >
      Файл: {fileName}
    </Typography>
  ) : (
    <Typography variant='body2' color='error' className={cnGpkgPlacementDialogFileHint()}>
      Файл не выбран
    </Typography>
  );
