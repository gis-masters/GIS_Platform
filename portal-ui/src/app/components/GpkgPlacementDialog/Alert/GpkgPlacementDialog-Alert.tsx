import React, { type FC } from 'react';
import { Alert } from '@mui/material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-Alert.scss';

const cnGpkgPlacementDialogAlert = cn('GpkgPlacementDialog', 'Alert');

interface GpkgPlacementDialogAlertProps {
  error?: string;
}

export const GpkgPlacementDialogAlert: FC<GpkgPlacementDialogAlertProps> = ({ error }) =>
  error && (
    <Alert severity='error' className={cnGpkgPlacementDialogAlert()}>
      {error}
    </Alert>
  );
