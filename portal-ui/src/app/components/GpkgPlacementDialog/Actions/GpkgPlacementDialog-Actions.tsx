import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { CheckOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import {
  beginPlacement,
  type GpkgPlacementOutcome,
  startPlacement
} from '../../../services/data/file-placement/gpkg-import.service';
import { formatGpkgReportIssues } from '../../../services/data/file-placement/gpkg-report';
import { type Dataset } from '../../../services/data/vectorData/vectorData.models';
import { Button } from '../../Button/Button';
import {
  GpkgRasterPlacementDialog,
  type GpkgRasterPlacementTarget
} from '../../GpkgRasterPlacementDialog/GpkgRasterPlacementDialog';
import { GpkgVectorTablePlacementDialog } from '../../GpkgVectorTablePlacementDialog/GpkgVectorTablePlacementDialog';
import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { type GpkgImportLayerTableRow } from '../Table/GpkgPlacementDialog-Table';

const cnGpkgPlacementDialogActions = cn('GpkgPlacementDialog', 'Actions');

interface GpkgPlacementDialogActionsProps {
  rowData: Pick<
    GpkgImportLayerTableRow,
    | 'payloadIndex'
    | 'tableName'
    | 'dataType'
    | 'fileId'
    | 'placementStatus'
    | 'setPlacementStatus'
    | 'noteImportFailure'
    | 'ensureSessionLayerGroup'
    | 'forgetSessionLayerGroupIfUnused'
    | 'autoDatasetExists'
    | 'chooseAutoDataset'
    | 'forgetAutoDatasetChoice'
    | 'ensureAutoDatasetPlacement'
  >;
}

type GpkgPlacementDialogActionsState = {
  dialogOpen: boolean;
  setDialogOpen(value: boolean): void;
};

/** Отчёт импорта может содержать ошибки при статусе процесса DONE. */
function layerIssueMessage(outcome: GpkgPlacementOutcome, tableName: string): string | undefined {
  const issues = outcome.issues.filter(issue => issue.name === tableName);

  return issues.length > 0 ? formatGpkgReportIssues(issues) : undefined;
}

export const GpkgPlacementDialogActions: FC<GpkgPlacementDialogActionsProps> = observer(({ rowData }) => {
  const state = useLocalObservable<GpkgPlacementDialogActionsState>(() => ({
    dialogOpen: false,
    setDialogOpen(value) {
      this.dialogOpen = value;
    }
  }));

  const placed = rowData.placementStatus === 'placed';
  const importing = rowData.placementStatus === 'importing';

  let startIcon = <LayerAddOutlined />;
  if (placed) {
    startIcon = <CheckOutlined color='success' />;
  } else if (state.dialogOpen) {
    startIcon = <LayerAdd />;
  }

  const handleChoosePlacement = useCallback(() => {
    if (placed || importing) {
      return;
    }

    state.setDialogOpen(true);
  }, [importing, placed, state]);

  const handleClose = useCallback(() => {
    state.setDialogOpen(false);
  }, [state]);

  const handlePlace = useCallback(
    async (dataset?: Dataset) => {
      const {
        fileId,
        tableName,
        setPlacementStatus,
        noteImportFailure,
        ensureSessionLayerGroup,
        forgetSessionLayerGroupIfUnused,
        ensureAutoDatasetPlacement,
        chooseAutoDataset,
        forgetAutoDatasetChoice
      } = rowData;

      if (!fileId || !setPlacementStatus || !ensureSessionLayerGroup || !ensureAutoDatasetPlacement) {
        return;
      }

      state.setDialogOpen(false);
      if (!dataset) {
        chooseAutoDataset?.();
      }
      setPlacementStatus('importing');

      try {
        const layerGroupId = await ensureSessionLayerGroup();
        const placement = beginPlacement({
          fileId,
          tableName,
          payloadIndex: rowData.payloadIndex,
          layerGroupId
        });

        try {
          const outcome = await (dataset ? placement.run(dataset.identifier) : ensureAutoDatasetPlacement(placement));

          const issue = layerIssueMessage(outcome, tableName);
          if (issue) {
            setPlacementStatus(undefined);
            noteImportFailure?.(issue);
            forgetSessionLayerGroupIfUnused?.();
            if (!dataset) {
              forgetAutoDatasetChoice?.();
            }

            return;
          }

          setPlacementStatus('placed');
        } catch (error) {
          placement.abort(error);
          throw error;
        }
      } catch (error: unknown) {
        setPlacementStatus(undefined);
        noteImportFailure?.(error);
        forgetSessionLayerGroupIfUnused?.();
        if (!dataset) {
          forgetAutoDatasetChoice?.();
        }
      }
    },
    [rowData, state]
  );

  const handleRasterPlace = useCallback(
    async (target: GpkgRasterPlacementTarget) => {
      const {
        fileId,
        tableName,
        setPlacementStatus,
        noteImportFailure,
        ensureSessionLayerGroup,
        forgetSessionLayerGroupIfUnused
      } = rowData;

      if (!fileId || !setPlacementStatus || !ensureSessionLayerGroup) {
        return;
      }

      state.setDialogOpen(false);
      setPlacementStatus('importing');

      try {
        const layerGroupId = await ensureSessionLayerGroup();
        const outcome = await startPlacement({
          fileId,
          tableName,
          payloadIndex: rowData.payloadIndex,
          vectorLayers: [],
          rasterLayers: [
            {
              gpkgLayerTableName: tableName,
              libraryIdentifier: target.libraryIdentifier,
              documentId: target.documentId,
              field: target.field
            }
          ],
          layerGroupId
        });

        const issue = layerIssueMessage(outcome, tableName);
        if (issue) {
          setPlacementStatus(undefined);
          noteImportFailure?.(issue);
          forgetSessionLayerGroupIfUnused?.();

          return;
        }

        setPlacementStatus('placed');
      } catch (error: unknown) {
        setPlacementStatus(undefined);
        noteImportFailure?.(error);
        forgetSessionLayerGroupIfUnused?.();
      }
    },
    [rowData, state]
  );

  const raster = rowData.dataType === 'TILES';

  return (
    <span className={cnGpkgPlacementDialogActions()}>
      <Button size='small' loading={importing} disabled={placed} startIcon={startIcon} onClick={handleChoosePlacement}>
        {placed ? 'Готово' : 'Импортировать'}
      </Button>
      {raster ? (
        <GpkgRasterPlacementDialog
          open={state.dialogOpen}
          tableName={rowData.tableName}
          onClose={handleClose}
          onPlace={handleRasterPlace}
        />
      ) : (
        <GpkgVectorTablePlacementDialog
          open={state.dialogOpen}
          tableName={rowData.tableName}
          autoDatasetExists={Boolean(rowData.autoDatasetExists)}
          onClose={handleClose}
          onPlace={handlePlace}
        />
      )}
    </span>
  );
});
