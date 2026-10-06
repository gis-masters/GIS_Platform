import React, { type FC } from 'react';
import { DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-Title.scss';

const cnGpkgPlacementDialogTitle = cn('GpkgPlacementDialog', 'Title');

export const GpkgPlacementDialogTitle: FC = () => (
  <DialogTitle className={cnGpkgPlacementDialogTitle()}>Импорт GeoPackage</DialogTitle>
);
