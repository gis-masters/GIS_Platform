import React, { type FC, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { GpkgPlacementDialogTypeIcon } from '../TypeIcon/GpkgPlacementDialog-TypeIcon';

import './GpkgPlacementDialog-ImportComposition.scss';

const cnGpkgPlacementDialogImportComposition = cn('GpkgPlacementDialog', 'ImportComposition');

export type GpkgImportComposition = {
  features: number;
  tiles: number;
};

interface GpkgPlacementDialogImportCompositionProps extends GpkgImportComposition {
  children: ReactNode;
}

export const GpkgPlacementDialogImportComposition: FC<GpkgPlacementDialogImportCompositionProps> = ({
  features,
  tiles,
  children
}) => {
  if (features === 0 && tiles === 0) {
    return <span className={cnGpkgPlacementDialogImportComposition()}>{children}</span>;
  }

  if (tiles === 0) {
    return (
      <span className={cnGpkgPlacementDialogImportComposition()}>
        {children} {features}
        <GpkgPlacementDialogTypeIcon type='vector' />
      </span>
    );
  }

  if (features === 0) {
    return (
      <span className={cnGpkgPlacementDialogImportComposition()}>
        {children} {tiles}
        <GpkgPlacementDialogTypeIcon type='raster' />
      </span>
    );
  }

  return (
    <span className={cnGpkgPlacementDialogImportComposition()}>
      {children} {features}
      <GpkgPlacementDialogTypeIcon type='vector' />и {tiles}
      <GpkgPlacementDialogTypeIcon type='raster' />
    </span>
  );
};
