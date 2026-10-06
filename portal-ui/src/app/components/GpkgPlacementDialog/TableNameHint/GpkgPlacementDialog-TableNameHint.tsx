import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { ErrorOutlined, HelpOutlineOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './GpkgPlacementDialog-TableNameHint.scss';

const cnGpkgPlacementDialogTableNameHint = cn('GpkgPlacementDialog', 'TableNameHint');

interface GpkgPlacementDialogTableNameHintProps {
  title: string;
  error?: boolean;
}

export const GpkgPlacementDialogTableNameHint: FC<GpkgPlacementDialogTableNameHintProps> = ({ title, error }) => (
  <Tooltip arrow placement='top' title={title}>
    {error ? (
      <ErrorOutlined className={cnGpkgPlacementDialogTableNameHint()} color='error' fontSize='small' />
    ) : (
      <HelpOutlineOutlined className={cnGpkgPlacementDialogTableNameHint()} color='action' fontSize='small' />
    )}
  </Tooltip>
);
