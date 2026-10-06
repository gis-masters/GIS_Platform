import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';
import {
  type GpkgImportComposition,
  GpkgPlacementDialogImportComposition
} from '../ImportComposition/GpkgPlacementDialog-ImportComposition';
import { type GpkgLayerPlacementStatus } from '../Table/GpkgPlacementDialog-Table';

const cnGpkgPlacementDialogImportAction = cn('GpkgPlacementDialog', 'ImportAction');

export function countGpkgImportComposition(
  layers: Array<{ dataType: string; payloadIndex: number }>,
  placementByIndex: Record<number, GpkgLayerPlacementStatus | undefined>
): GpkgImportComposition {
  return layers.reduce<GpkgImportComposition>(
    (composition, layer) => {
      if (placementByIndex[layer.payloadIndex] === 'placed' || placementByIndex[layer.payloadIndex] === 'importing') {
        return composition;
      }

      if (layer.dataType === 'TILES') {
        composition.tiles += 1;
      } else if (layer.dataType === 'FEATURES') {
        composition.features += 1;
      }

      return composition;
    },
    { features: 0, tiles: 0 }
  );
}

interface GpkgPlacementDialogImportActionProps {
  composition: GpkgImportComposition;
  loading?: boolean;
  onClick(): void;
}

export const GpkgPlacementDialogImportAction: FC<GpkgPlacementDialogImportActionProps> = ({
  composition,
  loading,
  onClick
}) => (
  <Button
    className={cnGpkgPlacementDialogImportAction()}
    color='primary'
    loading={loading}
    disabled={composition.features === 0 && composition.tiles === 0}
    onClick={onClick}
  >
    <GpkgPlacementDialogImportComposition features={composition.features} tiles={composition.tiles}>
      Импортировать
    </GpkgPlacementDialogImportComposition>
  </Button>
);
