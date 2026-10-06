import React, { type FC } from 'react';
import { observer } from 'mobx-react';

import { type GpkgImportRecord, gpkgImportStore, isSettledStatus } from '../../stores/GpkgImport.store';
import { GpkgPlacementDialogImportComposition } from '../GpkgPlacementDialog/ImportComposition/GpkgPlacementDialog-ImportComposition';

export type GpkgImportToastItem = Pick<
  GpkgImportRecord,
  'id' | 'tableName' | 'features' | 'tiles' | 'status' | 'error'
>;

type GpkgImportToastProps = {
  fileId?: string;
  items?: GpkgImportToastItem[];
};

type GpkgImportToastSummary = {
  title: string;
  features: number;
  tiles: number;
};

function sumComposition(items: GpkgImportToastItem[]): { features: number; tiles: number } {
  return items.reduce(
    (composition, item) => ({
      features: composition.features + item.features,
      tiles: composition.tiles + item.tiles
    }),
    { features: 0, tiles: 0 }
  );
}

function summarize(items: GpkgImportToastItem[], stillRunning: boolean): GpkgImportToastSummary {
  const { features, tiles } = sumComposition(items);

  if (stillRunning || items.some(item => item.status === 'running')) {
    return { title: 'Импорт:', features, tiles };
  }

  if (items.every(item => item.status === 'done')) {
    return {
      title: items.length > 1 ? 'Слои размещены:' : 'Слой размещён:',
      features,
      tiles
    };
  }

  if (items.length > 1 && items.every(item => item.status === 'error')) {
    return { title: 'Не удалось разместить слои', features: 0, tiles: 0 };
  }

  if (items.length === 1 && isSettledStatus(items[0].status)) {
    return { title: items[0].error ?? 'Не удалось разместить слой', features: 0, tiles: 0 };
  }

  return { title: 'Импорт завершён с ошибками', features: 0, tiles: 0 };
}

export const GpkgImportToast: FC<GpkgImportToastProps> = observer(({ fileId, items }) => {
  const cohort = items ?? (fileId ? gpkgImportStore.getToastCohort(fileId) : []);
  const stillRunning = !items && fileId != null && gpkgImportStore.hasImports(fileId);

  if (cohort.length === 0) {
    return null;
  }

  const { title, features, tiles } = summarize(cohort, stillRunning);

  return (
    <GpkgPlacementDialogImportComposition features={features} tiles={tiles}>
      {title}
    </GpkgPlacementDialogImportComposition>
  );
});
