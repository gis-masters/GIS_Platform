import React, { type FC } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { Cancel, CheckCircle, WarningAmber } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { GpkgPlacementDialogImportComposition } from '../ImportComposition/GpkgPlacementDialog-ImportComposition';

import './GpkgPlacementDialog-ImportStatus.scss';

const cnGpkgPlacementDialogImportStatus = cn('GpkgPlacementDialog', 'ImportStatus');

type GpkgPlacementDialogSimpleImportStatus = 'running' | 'done' | 'warning' | 'error';

export type GpkgPlacementDialogSimpleImport = {
  status: GpkgPlacementDialogSimpleImportStatus;
  features: number;
  tiles: number;
  error?: string;
};

interface GpkgPlacementDialogImportStatusProps {
  simpleImport: GpkgPlacementDialogSimpleImport;
  footer?: boolean;
}

function importStatusTitle({ status, features, tiles, error }: GpkgPlacementDialogSimpleImport): string {
  const layerCount = features + tiles;

  if (status === 'running') {
    return 'Импорт:';
  }

  if (status === 'done') {
    return layerCount > 1 ? 'Слои размещены:' : 'Слой размещён:';
  }

  if (status === 'warning') {
    return error ? `Часть слоёв не размещена: ${error}` : 'Часть слоёв не размещена';
  }

  if (layerCount > 1 && !error) {
    return 'Не удалось разместить слои';
  }

  return error || 'Не удалось разместить слой';
}

export const GpkgPlacementDialogImportStatus: FC<GpkgPlacementDialogImportStatusProps> = ({ simpleImport, footer }) => {
  const failed = simpleImport.status === 'error';

  let icon = <CircularProgress color='inherit' size={20} />;

  switch (simpleImport.status) {
    case 'done': {
      icon = <CheckCircle color='success' fontSize='small' />;
      break;
    }
    case 'warning': {
      icon = <WarningAmber color='warning' fontSize='small' />;
      break;
    }
    case 'error': {
      icon = <Cancel color='error' fontSize='small' />;
      break;
    }
    default: {
      break;
    }
  }

  return (
    <Typography variant='body2' className={cnGpkgPlacementDialogImportStatus({ footer })}>
      {icon}
      <GpkgPlacementDialogImportComposition
        features={failed ? 0 : simpleImport.features}
        tiles={failed ? 0 : simpleImport.tiles}
      >
        {importStatusTitle(simpleImport)}
      </GpkgPlacementDialogImportComposition>
    </Typography>
  );
};
