import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type GpkgImportStatus, gpkgImportStore } from '../../stores/GpkgImport.store';
import { type GpkgImportToastItem } from '../GpkgImportToast/GpkgImportToast';
import { GpkgPlacementDialogImportComposition } from '../GpkgPlacementDialog/ImportComposition/GpkgPlacementDialog-ImportComposition';

import './GpkgImportToastDetails.scss';

const cnGpkgImportToastDetails = cn('GpkgImportToastDetails');

type GpkgImportToastDetailsProps = {
  fileId?: string;
  items?: GpkgImportToastItem[];
};

function processStatus(status: GpkgImportStatus, error?: string): string {
  if (status === 'running') {
    return 'выполняется';
  }

  if (status === 'done') {
    return 'размещён';
  }

  if (error) {
    return error;
  }

  return status === 'warning' ? 'Часть слоёв не размещена' : 'Не удалось разместить слой';
}

export const GpkgImportToastDetails: FC<GpkgImportToastDetailsProps> = observer(({ fileId, items }) => {
  const cohort = items ?? (fileId ? gpkgImportStore.getToastCohort(fileId) : []);

  return (
    <div className={cnGpkgImportToastDetails()}>
      {cohort.map(item => {
        const hasComposition = item.features > 0 || item.tiles > 0;

        return (
          <div key={item.id} className={cnGpkgImportToastDetails('Item')}>
            {hasComposition && (
              <GpkgPlacementDialogImportComposition features={item.features} tiles={item.tiles}>
                {''}
              </GpkgPlacementDialogImportComposition>
            )}
            {processStatus(item.status, item.error)}
          </div>
        );
      })}
    </div>
  );
});
