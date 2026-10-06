import React, { type FC } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-Loading.scss';

const cnGpkgPlacementDialogLoading = cn('GpkgPlacementDialog', 'Loading');

export const GpkgPlacementDialogLoading: FC = () => (
  <Box className={cnGpkgPlacementDialogLoading()}>
    <CircularProgress size={40} />
    <Typography
      variant='body2'
      sx={{
        color: 'text.secondary'
      }}
    >
      Загрузка файла и получение сведений о содержимом…
    </Typography>
  </Box>
);
