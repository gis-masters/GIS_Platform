import React, { type FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type GpkgContentsBaseDtoUnion, type GpkgFileMetadata } from '../../../server-types/common-contracts';
import {
  beginBulkPlacement,
  type GpkgPlacement,
  type GpkgPlacementOutcome
} from '../../services/data/file-placement/gpkg-import.service';
import {
  formatGpkgReportIssues,
  type GpkgReportIssue,
  readGpkgFailedLayerNames
} from '../../services/data/file-placement/gpkg-report';
import { deleteFile, uploadGpkgAndFetchMetadata } from '../../services/data/files/files.service';
import { type Dataset } from '../../services/data/vectorData/vectorData.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { isAxiosError } from '../../services/util/typeGuards/isAxiosError';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { currentProject } from '../../stores/CurrentProject.store';
import { gpkgImportStore } from '../../stores/GpkgImport.store';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import {
  GpkgRasterPlacementDialog,
  type GpkgRasterPlacementTarget
} from '../GpkgRasterPlacementDialog/GpkgRasterPlacementDialog';
import { GpkgVectorTablePlacementDialog } from '../GpkgVectorTablePlacementDialog/GpkgVectorTablePlacementDialog';
import { Toast } from '../Toast/Toast';
import { GpkgPlacementDialogAlert } from './Alert/GpkgPlacementDialog-Alert';
import { GpkgPlacementDialogDestination } from './Destination/GpkgPlacementDialog-Destination';
import { GpkgPlacementDialogFileHint } from './FileHint/GpkgPlacementDialog-FileHint';
import {
  countGpkgImportComposition,
  GpkgPlacementDialogImportAction
} from './ImportAction/GpkgPlacementDialog-ImportAction';
import {
  GpkgPlacementDialogImportStatus,
  type GpkgPlacementDialogSimpleImport
} from './ImportStatus/GpkgPlacementDialog-ImportStatus';
import { GpkgPlacementDialogLayerStats } from './LayerStats/GpkgPlacementDialog-LayerStats';
import { GpkgPlacementDialogLoading } from './Loading/GpkgPlacementDialog-Loading';
import {
  type GpkgImportLayerTableRow,
  type GpkgLayerPlacementStatus,
  GpkgPlacementDialogTable
} from './Table/GpkgPlacementDialog-Table';
import { GpkgPlacementDialogTitle } from './Title/GpkgPlacementDialog-Title';
import { GpkgPlacementDialogViewLink } from './ViewLink/GpkgPlacementDialog-ViewLink';

import './GpkgPlacementDialog.scss';

const cnGpkgPlacementDialog = cn('GpkgPlacementDialog');

export interface GpkgPlacementDialogProps {
  open: boolean;
  onClose(): void;
  file?: File;
}

type GpkgPlacementDialogView = 'simple' | 'advanced';

type GpkgPlacementDialogState = {
  loading: boolean;
  error: string | undefined;
  metadata: GpkgFileMetadata | undefined;
  selectedLayers: GpkgImportLayerTableRow[];
  placementByIndex: Record<number, GpkgLayerPlacementStatus>;
  sessionLayerGroupPromise: Promise<number> | undefined;
  sessionLayerGroupPlaced: boolean;
  sessionAutoDatasetIdentifier: string | undefined;
  sessionAutoDatasetPromise: Promise<string | undefined> | undefined;
  sessionAutoDatasetChosen: boolean;
  view: GpkgPlacementDialogView;
  simpleImport: GpkgPlacementDialogSimpleImport | undefined;
  failedByIndex: Record<number, string | undefined>;
  bulkVectorOpen: boolean;
  bulkRasterOpen: boolean;
  pendingDataset: Dataset | undefined;
  get layerRows(): GpkgImportLayerTableRow[];
  get autoDatasetExists(): boolean;
  beginLoad(): void;
  applyMetadata(metadata: GpkgFileMetadata): void;
  applyError(message: string): void;
  setSelectedLayers(items: GpkgImportLayerTableRow[]): void;
  setPlacementStatus(payloadIndex: number, status?: GpkgLayerPlacementStatus): void;
  setPlacementStatuses(payloadIndexes: number[], status?: GpkgLayerPlacementStatus): void;
  setView(view: GpkgPlacementDialogView): void;
  beginSimpleImport(features: number, tiles: number): void;
  finishSimpleImport(): void;
  failSimpleImport(message?: string): void;
  warnSimpleImport(message?: string): void;
  noteLayerImportFailure(payloadIndex: number, error?: unknown): void;
  clearLayerImportFailure(payloadIndex: number): void;
  setBulkVectorOpen(value: boolean): void;
  setBulkRasterOpen(value: boolean): void;
  setPendingDataset(dataset: Dataset | undefined): void;
  ensureSessionLayerGroup(title: string): Promise<number>;
  clearSessionLayerGroupPromise(): void;
  forgetSessionLayerGroupIfUnused(): void;
  rememberSessionAutoDataset(identifier: string | undefined): void;
  chooseAutoDataset(): void;
  forgetAutoDatasetChoice(): void;
  setSessionAutoDatasetPromise(promise: Promise<string | undefined> | undefined): void;
  clearSessionAutoDatasetPromise(): void;
  reset(): void;
};

function placeInSessionAutoDataset(
  session: Pick<
    GpkgPlacementDialogState,
    | 'sessionAutoDatasetIdentifier'
    | 'sessionAutoDatasetPromise'
    | 'rememberSessionAutoDataset'
    | 'chooseAutoDataset'
    | 'forgetAutoDatasetChoice'
    | 'setSessionAutoDatasetPromise'
    | 'clearSessionAutoDatasetPromise'
  >,
  placement: GpkgPlacement
): Promise<GpkgPlacementOutcome> {
  if (session.sessionAutoDatasetIdentifier) {
    return placement.run(session.sessionAutoDatasetIdentifier);
  }

  if (session.sessionAutoDatasetPromise) {
    placement.hold();

    return session.sessionAutoDatasetPromise.then(identifier => {
      if (!identifier) {
        placement.abort();
        throw new Error('Не удалось запустить импорт');
      }

      return placement.run(identifier);
    });
  }

  session.chooseAutoDataset();

  const started = placement.run();
  const datasetPromise: Promise<string | undefined> = started
    .then(outcome => {
      const identifier = outcome.datasetIdentifier;

      if (session.sessionAutoDatasetPromise !== datasetPromise) {
        return identifier;
      }

      session.rememberSessionAutoDataset(identifier);

      if (!session.sessionAutoDatasetIdentifier) {
        session.clearSessionAutoDatasetPromise();
        session.forgetAutoDatasetChoice();
      }

      return session.sessionAutoDatasetIdentifier;
    })
    .catch((error: unknown) => {
      if (session.sessionAutoDatasetPromise === datasetPromise) {
        session.clearSessionAutoDatasetPromise();
        session.forgetAutoDatasetChoice();
      }

      throw error;
    });

  session.setSessionAutoDatasetPromise(datasetPromise);
  void datasetPromise.catch(() => false);

  return started;
}

function getRequestErrorMessage(err: unknown, fallback = 'Не удалось получить сведения о GeoPackage'): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;

    if (isRecordStringUnknown(data) && typeof data.message === 'string' && data.message) {
      return data.message;
    }

    return err.message;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}

/** Векторные (FEATURES) и растровые тайлы (TILES) — доступны для выбора при импорте. */
function isImportableGpkgLayerRow(row: GpkgContentsBaseDtoUnion): boolean {
  return row.dataType === 'FEATURES' || row.dataType === 'TILES';
}

function gpkgLayerFeatureCount(row: GpkgContentsBaseDtoUnion): number | null {
  if (row.dataType === 'FEATURES' && row.type === 'features') {
    return row.featureCount;
  }

  return null;
}

function gpkgLayerSriId(row: GpkgContentsBaseDtoUnion): number {
  if (row.dataType === 'FEATURES' && row.type === 'features') {
    return row.sriId;
  }

  if (row.dataType === 'TILES' && row.type === 'tiles') {
    return row.sriId;
  }

  return 0;
}

function toGpkgImportLayerTableRow(row: GpkgContentsBaseDtoUnion, payloadIndex: number): GpkgImportLayerTableRow {
  return {
    payloadIndex,
    tableName: row.tableName,
    description: row.description?.trim() ?? '',
    dataType: row.dataType,
    featureCount: gpkgLayerFeatureCount(row),
    sriId: gpkgLayerSriId(row)
  };
}

function buildGpkgImportLayerRows(metadata: GpkgFileMetadata): GpkgImportLayerTableRow[] {
  return (metadata.payload ?? [])
    .map((row, payloadIndex) => ({ row, payloadIndex }))
    .filter(({ row }) => isImportableGpkgLayerRow(row))
    .map(({ row, payloadIndex }) => toGpkgImportLayerTableRow(row, payloadIndex));
}

function countLayersByKind(
  rows: Array<{ dataType: GpkgImportLayerTableRow['dataType'] }>
): Pick<GpkgPlacementDialogSimpleImport, 'features' | 'tiles'> {
  return rows.reduce(
    (composition, row) => {
      if (row.dataType === 'TILES') {
        composition.tiles += 1;
      } else if (row.dataType === 'FEATURES') {
        composition.features += 1;
      }

      return composition;
    },
    { features: 0, tiles: 0 }
  );
}

function hasRecordedImportFailure(failedByIndex: Record<number, string | undefined>, payloadIndex: number): boolean {
  return Object.hasOwn(failedByIndex, payloadIndex);
}

function layerImportFailureMessage(error?: unknown): string | undefined {
  if (typeof error === 'string') {
    return error || undefined;
  }

  if (error == null) {
    return;
  }

  return getRequestErrorMessage(error, 'Не удалось разместить слой');
}

function advancedFooterImport(
  rows: GpkgImportLayerTableRow[],
  failedByIndex: Record<number, string | undefined>
): GpkgPlacementDialogSimpleImport | undefined {
  const importing = rows.filter(row => row.placementStatus === 'importing');

  if (importing.length > 0) {
    return { status: 'running', ...countLayersByKind(importing) };
  }

  const failed = rows.filter(
    row => row.placementStatus !== 'placed' && hasRecordedImportFailure(failedByIndex, row.payloadIndex)
  );
  const placed = rows.filter(row => row.placementStatus === 'placed');

  if (failed.length > 0) {
    const [first] = failed;
    // при нескольких упавших слоях в подписи остаётся причина первой, детали по слоям — в таблице
    const error = first ? failedByIndex[first.payloadIndex] : undefined;

    if (placed.length > 0) {
      return { status: 'warning', ...countLayersByKind(placed), error };
    }

    return { status: 'error', ...countLayersByKind(failed), error };
  }

  const unstarted = rows.filter(row => row.placementStatus !== 'placed');

  if (unstarted.length > 0 || placed.length === 0) {
    return;
  }

  return { status: 'done', ...countLayersByKind(placed) };
}

function isGpkgLayerBusy(
  payloadIndex: number,
  placementByIndex: Record<number, GpkgLayerPlacementStatus | undefined>
): boolean {
  const status = placementByIndex[payloadIndex];

  return status === 'placed' || status === 'importing';
}

function layerIssues(issues: GpkgReportIssue[], layer: Pick<GpkgImportLayerTableRow, 'tableName'>): GpkgReportIssue[] {
  return issues.filter(issue => issue.name === layer.tableName);
}

function failureMessageForLayer(issues: GpkgReportIssue[], layer: Pick<GpkgImportLayerTableRow, 'tableName'>) {
  return formatGpkgReportIssues(layerIssues(issues, layer)) || formatGpkgReportIssues(issues);
}

function failedStartedLayers(layers: GpkgImportLayerTableRow[], issues: GpkgReportIssue[]): GpkgImportLayerTableRow[] {
  const failed = readGpkgFailedLayerNames(issues);

  return failed.size > 0 ? layers.filter(layer => failed.has(layer.tableName)) : [];
}

function getUnplacedSelectedGpkgLayers(
  layers: GpkgImportLayerTableRow[],
  placementByIndex: Record<number, GpkgLayerPlacementStatus | undefined>,
  dataType: GpkgImportLayerTableRow['dataType']
): GpkgImportLayerTableRow[] {
  return layers.filter(layer => layer.dataType === dataType && !isGpkgLayerBusy(layer.payloadIndex, placementByIndex));
}

function startSimpleImportIfNeeded(
  state: Pick<GpkgPlacementDialogState, 'view' | 'beginSimpleImport'>,
  features: number,
  tiles: number
): boolean {
  if (state.view !== 'simple') {
    return false;
  }

  state.beginSimpleImport(features, tiles);

  return true;
}

function finishSimpleImportIfTracked(
  tracked: boolean,
  state: Pick<GpkgPlacementDialogState, 'finishSimpleImport'>
): void {
  if (tracked) {
    state.finishSimpleImport();
  }
}

function failSimpleImportIfTracked(
  tracked: boolean,
  state: Pick<GpkgPlacementDialogState, 'failSimpleImport'>,
  message?: string
): void {
  if (tracked) {
    state.failSimpleImport(message);
  }
}

function simpleImportFailureMessage(error: unknown): string {
  return getRequestErrorMessage(error, 'Не удалось разместить слой');
}

type GpkgBulkReportState = Pick<
  GpkgPlacementDialogState,
  | 'setPlacementStatuses'
  | 'noteLayerImportFailure'
  | 'forgetSessionLayerGroupIfUnused'
  | 'warnSimpleImport'
  | 'finishSimpleImport'
  | 'failSimpleImport'
>;

/**
 * Процесс импорта может завершиться со статусом DONE, когда часть слоёв в отчёте
 * details.payload помечена ERROR: размещённые слои отмечаем, остальные оставляем для повтора.
 */
function applyBulkPlacementReport(
  state: GpkgBulkReportState,
  startedLayers: GpkgImportLayerTableRow[],
  issues: GpkgReportIssue[],
  trackSimpleImport: boolean
): void {
  const failed = failedStartedLayers(startedLayers, issues);
  const placed = startedLayers.filter(layer => !failed.includes(layer));
  const message = formatGpkgReportIssues(issues);

  if (placed.length > 0) {
    state.setPlacementStatuses(
      placed.map(layer => layer.payloadIndex),
      'placed'
    );
  }

  if (failed.length > 0) {
    state.setPlacementStatuses(
      failed.map(layer => layer.payloadIndex),
      undefined
    );
    failed.forEach(layer => {
      state.noteLayerImportFailure(layer.payloadIndex, failureMessageForLayer(issues, layer));
    });
    state.forgetSessionLayerGroupIfUnused();
  }

  if (issues.length === 0) {
    finishSimpleImportIfTracked(trackSimpleImport, state);
  } else if (placed.length > 0) {
    state.warnSimpleImport(message);
  } else {
    failSimpleImportIfTracked(trackSimpleImport, state, message);
  }
}

async function deleteUploadedGpkg(fileId: string): Promise<void> {
  try {
    await deleteFile(fileId);
  } catch {
    // закрытие диалога не зависит от результата удаления
  }
}

export const GpkgPlacementDialog: FC<GpkgPlacementDialogProps> = observer(({ open, onClose, file }) => {
  const state = useLocalObservable<GpkgPlacementDialogState>(() => ({
    loading: false,
    error: undefined,
    metadata: undefined,
    selectedLayers: [],
    placementByIndex: {},
    sessionLayerGroupPromise: undefined,
    sessionLayerGroupPlaced: false,
    sessionAutoDatasetIdentifier: undefined,
    sessionAutoDatasetPromise: undefined,
    sessionAutoDatasetChosen: false,
    view: 'simple',
    simpleImport: undefined,
    failedByIndex: {},
    bulkVectorOpen: false,
    bulkRasterOpen: false,
    pendingDataset: undefined,

    get layerRows() {
      return this.metadata ? buildGpkgImportLayerRows(this.metadata) : [];
    },

    get autoDatasetExists() {
      return Boolean(
        this.sessionAutoDatasetIdentifier || this.sessionAutoDatasetPromise || this.sessionAutoDatasetChosen
      );
    },

    beginLoad() {
      this.loading = true;
      this.error = undefined;
      this.metadata = undefined;
      this.selectedLayers = [];
      this.placementByIndex = {};
      this.sessionLayerGroupPromise = undefined;
      this.sessionLayerGroupPlaced = false;
      this.sessionAutoDatasetIdentifier = undefined;
      this.sessionAutoDatasetPromise = undefined;
      this.sessionAutoDatasetChosen = false;
      this.view = 'simple';
      this.simpleImport = undefined;
      this.failedByIndex = {};
      this.bulkVectorOpen = false;
      this.bulkRasterOpen = false;
      this.pendingDataset = undefined;
    },

    applyMetadata(metadata) {
      this.metadata = metadata;
      this.selectedLayers = buildGpkgImportLayerRows(metadata);
      this.loading = false;
    },

    applyError(message) {
      this.error = message;
      this.loading = false;
    },

    setSelectedLayers(items) {
      this.selectedLayers = items;
    },

    setView(view) {
      this.view = view;
    },

    beginSimpleImport(features, tiles) {
      this.simpleImport = { status: 'running', features, tiles };
    },

    finishSimpleImport() {
      if (!this.simpleImport) {
        return;
      }

      this.simpleImport = { ...this.simpleImport, status: 'done', error: undefined };
    },

    failSimpleImport(message) {
      if (!this.simpleImport) {
        return;
      }

      this.simpleImport = { ...this.simpleImport, status: 'error', error: message };
    },

    warnSimpleImport(message) {
      if (!this.simpleImport) {
        return;
      }

      this.simpleImport = { ...this.simpleImport, status: 'warning', error: message };
    },

    noteLayerImportFailure(payloadIndex, error) {
      this.failedByIndex = { ...this.failedByIndex, [payloadIndex]: layerImportFailureMessage(error) };
    },

    clearLayerImportFailure(payloadIndex) {
      if (!hasRecordedImportFailure(this.failedByIndex, payloadIndex)) {
        return;
      }

      const next = { ...this.failedByIndex };
      delete next[payloadIndex];
      this.failedByIndex = next;
    },

    setBulkVectorOpen(value) {
      this.bulkVectorOpen = value;
    },

    setBulkRasterOpen(value) {
      this.bulkRasterOpen = value;
    },

    setPendingDataset(dataset) {
      this.pendingDataset = dataset;
    },

    setPlacementStatus(payloadIndex, status) {
      if (!status) {
        const next = { ...this.placementByIndex };
        delete next[payloadIndex];
        this.placementByIndex = next;

        return;
      }

      if (status === 'placed' || status === 'importing') {
        this.clearLayerImportFailure(payloadIndex);
      }

      this.placementByIndex = { ...this.placementByIndex, [payloadIndex]: status };

      if (status === 'placed' || status === 'importing') {
        this.selectedLayers = this.selectedLayers.filter(layer => layer.payloadIndex !== payloadIndex);
      }

      if (status === 'placed') {
        this.sessionLayerGroupPlaced = true;
      }
    },

    setPlacementStatuses(payloadIndexes, status) {
      const started = new Set(payloadIndexes);

      if (!status) {
        const next = { ...this.placementByIndex };
        payloadIndexes.forEach(payloadIndex => {
          delete next[payloadIndex];
        });
        this.placementByIndex = next;

        return;
      }

      const next = { ...this.placementByIndex };
      payloadIndexes.forEach(payloadIndex => {
        next[payloadIndex] = status;
        if (status === 'placed' || status === 'importing') {
          this.clearLayerImportFailure(payloadIndex);
        }
      });
      this.placementByIndex = next;

      if (status === 'placed' || status === 'importing') {
        this.selectedLayers = this.selectedLayers.filter(layer => !started.has(layer.payloadIndex));
      }

      if (status === 'placed') {
        this.sessionLayerGroupPlaced = true;
      }
    },

    ensureSessionLayerGroup(title) {
      if (this.sessionLayerGroupPromise) {
        return this.sessionLayerGroupPromise;
      }

      if (!title) {
        throw new Error('Не задано имя файла GeoPackage');
      }

      this.sessionLayerGroupPromise = (async () => {
        try {
          const group = await projectsService.createGroup(
            {
              title,
              enabled: true,
              expanded: true,
              position: -1,
              transparency: 100
            },
            currentProject.id
          );

          return group.id;
        } catch (error) {
          this.clearSessionLayerGroupPromise();
          throw error;
        }
      })();

      return this.sessionLayerGroupPromise;
    },

    clearSessionLayerGroupPromise() {
      this.sessionLayerGroupPromise = undefined;
    },

    forgetSessionLayerGroupIfUnused() {
      if (this.sessionLayerGroupPlaced) {
        return;
      }

      if (Object.values(this.placementByIndex).includes('importing')) {
        return;
      }

      this.clearSessionLayerGroupPromise();
    },

    rememberSessionAutoDataset(identifier) {
      if (identifier) {
        this.sessionAutoDatasetIdentifier = identifier;
        this.sessionAutoDatasetChosen = true;
      }
    },

    chooseAutoDataset() {
      this.sessionAutoDatasetChosen = true;
    },

    forgetAutoDatasetChoice() {
      if (this.sessionAutoDatasetIdentifier || this.sessionAutoDatasetPromise) {
        return;
      }

      this.sessionAutoDatasetChosen = false;
    },

    setSessionAutoDatasetPromise(promise) {
      this.sessionAutoDatasetPromise = promise;
    },

    clearSessionAutoDatasetPromise() {
      this.sessionAutoDatasetPromise = undefined;
    },

    reset() {
      this.loading = false;
      this.error = undefined;
      this.metadata = undefined;
      this.selectedLayers = [];
      this.placementByIndex = {};
      this.sessionLayerGroupPromise = undefined;
      this.sessionLayerGroupPlaced = false;
      this.sessionAutoDatasetIdentifier = undefined;
      this.sessionAutoDatasetPromise = undefined;
      this.sessionAutoDatasetChosen = false;
      this.view = 'simple';
      this.simpleImport = undefined;
      this.failedByIndex = {};
      this.bulkVectorOpen = false;
      this.bulkRasterOpen = false;
      this.pendingDataset = undefined;
    }
  }));

  useEffect(() => {
    if (!open || !file) {
      state.reset();

      return;
    }

    let cancelled = false;

    state.beginLoad();

    void (async () => {
      try {
        const meta = await uploadGpkgAndFetchMetadata(file);

        if (cancelled) {
          if (!gpkgImportStore.hasImports(meta.id)) {
            await deleteUploadedGpkg(meta.id);
          }

          return;
        }

        state.applyMetadata(meta);
        gpkgImportStore.setToastVisible(meta.id, false);
      } catch (error_) {
        if (!cancelled) {
          state.applyError(getRequestErrorMessage(error_));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, file, state]);

  const handleClose = useCallback(() => {
    const uploadedFileId = state.metadata?.id;

    if (uploadedFileId) {
      if (gpkgImportStore.hasImports(uploadedFileId)) {
        gpkgImportStore.setToastVisible(uploadedFileId, true);
      } else {
        void deleteUploadedGpkg(uploadedFileId);
      }
    }

    onClose();
  }, [onClose, state]);

  const handleLayersSelected = useCallback(
    (items: GpkgImportLayerTableRow[]) => {
      state.setSelectedLayers([...items]);
    },
    [state]
  );

  const handleSelectLayers = useCallback(() => {
    state.setView('advanced');
  }, [state]);

  const handleOpenBulkPlacement = useCallback(() => {
    const nextComposition = countGpkgImportComposition(state.selectedLayers, state.placementByIndex);
    if (nextComposition.features > 0) {
      state.setBulkVectorOpen(true);

      return;
    }

    if (nextComposition.tiles > 0) {
      state.setBulkRasterOpen(true);
    }
  }, [state]);

  const handleCloseBulkVector = useCallback(() => {
    state.setBulkVectorOpen(false);
    state.setPendingDataset(undefined);
  }, [state]);

  const handleCloseBulkRaster = useCallback(() => {
    state.setBulkRasterOpen(false);
    state.setPendingDataset(undefined);
    state.forgetAutoDatasetChoice();
  }, [state]);

  const runBulkImport = useCallback(
    async (dataset?: Dataset, rasterTarget?: GpkgRasterPlacementTarget) => {
      if (!dataset) {
        state.chooseAutoDataset();
      }

      const uploadedFileId = state.metadata?.id;
      const vectorLayers = getUnplacedSelectedGpkgLayers(state.selectedLayers, state.placementByIndex, 'FEATURES');
      const rasterLayers = getUnplacedSelectedGpkgLayers(state.selectedLayers, state.placementByIndex, 'TILES');
      const startedLayers = [...vectorLayers, ...rasterLayers];

      if (!uploadedFileId || startedLayers.length === 0 || (rasterLayers.length > 0 && !rasterTarget)) {
        state.forgetAutoDatasetChoice();

        return;
      }

      const isCurrentUpload = (): boolean => state.metadata?.id === uploadedFileId;
      const unplacedRemain = state.layerRows.some(
        row =>
          !startedLayers.some(layer => layer.payloadIndex === row.payloadIndex) &&
          !isGpkgLayerBusy(row.payloadIndex, state.placementByIndex)
      );

      state.setPlacementStatuses(
        startedLayers.map(layer => layer.payloadIndex),
        'importing'
      );

      if (unplacedRemain && state.view === 'simple') {
        state.setView('advanced');
      }

      const trackSimpleImport = startSimpleImportIfNeeded(state, vectorLayers.length, rasterLayers.length);

      try {
        const layerGroupId = await state.ensureSessionLayerGroup(file?.name ?? '');
        if (!isCurrentUpload()) {
          return;
        }

        const placement = beginBulkPlacement({
          fileId: uploadedFileId,
          vectorLayers,
          rasterLayers,
          rasterTarget,
          layerGroupId
        });
        const started = (
          dataset ? placement.run(dataset.identifier) : placeInSessionAutoDataset(state, placement)
        ).catch((error: unknown) => {
          placement.abort(error);
          throw error;
        });

        try {
          const outcome = await started;
          if (!isCurrentUpload()) {
            return;
          }

          applyBulkPlacementReport(state, startedLayers, outcome.issues, trackSimpleImport);
        } catch (error: unknown) {
          if (!isCurrentUpload()) {
            return;
          }

          const failureMessage = simpleImportFailureMessage(error);
          state.setPlacementStatuses(
            startedLayers.map(layer => layer.payloadIndex),
            undefined
          );
          startedLayers.forEach(layer => {
            state.noteLayerImportFailure(layer.payloadIndex, failureMessage);
          });
          state.forgetSessionLayerGroupIfUnused();
          state.forgetAutoDatasetChoice();
          failSimpleImportIfTracked(trackSimpleImport, state, failureMessage);
        }
      } catch {
        if (isCurrentUpload()) {
          const groupError = 'Не удалось создать группу слоёв';
          state.setPlacementStatuses(
            startedLayers.map(layer => layer.payloadIndex),
            undefined
          );
          startedLayers.forEach(layer => {
            state.noteLayerImportFailure(layer.payloadIndex, groupError);
          });
          state.forgetAutoDatasetChoice();
          Toast.error(groupError);
          failSimpleImportIfTracked(trackSimpleImport, state, groupError);
        }
      }
    },
    [file?.name, state]
  );

  const handleBulkVectorPlace = useCallback(
    (dataset?: Dataset) => {
      if (!dataset) {
        state.chooseAutoDataset();
      }

      state.setBulkVectorOpen(false);

      const tiles = getUnplacedSelectedGpkgLayers(state.selectedLayers, state.placementByIndex, 'TILES');
      if (tiles.length > 0) {
        state.setPendingDataset(dataset);
        state.setBulkRasterOpen(true);

        return;
      }

      void runBulkImport(dataset);
    },
    [runBulkImport, state]
  );

  const handleBulkRasterPlace = useCallback(
    (target: GpkgRasterPlacementTarget) => {
      state.setBulkRasterOpen(false);
      const dataset = state.pendingDataset;
      state.setPendingDataset(undefined);
      void runBulkImport(dataset, target);
    },
    [runBulkImport, state]
  );

  const selectedLayerIds = new Set(state.selectedLayers.map(row => row.payloadIndex));
  const fileId = state.metadata?.id ?? '';
  const simpleView = state.view === 'simple';
  const metadataReady = !state.loading && Boolean(state.metadata) && !state.error;
  const hasImportableLayers = state.layerRows.length > 0;
  const composition = countGpkgImportComposition(state.selectedLayers, state.placementByIndex);
  const tableRows = state.layerRows.map(row => {
    const localStatus = state.placementByIndex[row.payloadIndex];
    const placementStatus =
      localStatus !== 'placed' && gpkgImportStore.hasRunning(fileId, row.payloadIndex) ? 'importing' : localStatus;

    return {
      ...row,
      selected: selectedLayerIds.has(row.payloadIndex),
      fileId,
      placementStatus,
      importFailure: state.failedByIndex[row.payloadIndex],
      setPlacementStatus(status: GpkgLayerPlacementStatus | undefined) {
        if (state.metadata?.id !== fileId) {
          return;
        }

        state.setPlacementStatus(row.payloadIndex, status);
      },
      noteImportFailure(error: unknown) {
        if (state.metadata?.id !== fileId) {
          return;
        }

        state.noteLayerImportFailure(row.payloadIndex, error);
      },
      ensureSessionLayerGroup() {
        return state.ensureSessionLayerGroup(file?.name ?? '');
      },
      forgetSessionLayerGroupIfUnused() {
        state.forgetSessionLayerGroupIfUnused();
      },
      autoDatasetExists: state.autoDatasetExists,
      chooseAutoDataset() {
        state.chooseAutoDataset();
      },
      forgetAutoDatasetChoice() {
        state.forgetAutoDatasetChoice();
      },
      ensureAutoDatasetPlacement(placement: GpkgPlacement) {
        return placeInSessionAutoDataset(state, placement);
      }
    };
  });
  const selectionImportable = composition.features > 0 || composition.tiles > 0;
  const footerImport = simpleView ? undefined : advancedFooterImport(tableRows, state.failedByIndex);
  const layerImportingCount = tableRows.filter(row => row.placementStatus === 'importing').length;
  const layerImportedCount = tableRows.filter(row => row.placementStatus === 'placed').length;

  return (
    <Dialog
      maxWidth={simpleView ? 'sm' : 'lg'}
      fullWidth
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: { className: cnGpkgPlacementDialog({ view: state.view }) }
      }}
    >
      <GpkgPlacementDialogTitle />

      <DialogContent>
        <GpkgPlacementDialogFileHint fileName={file?.name} />

        {metadataReady && (
          <GpkgPlacementDialogLayerStats
            total={tableRows.length}
            importing={layerImportingCount}
            imported={layerImportedCount}
          />
        )}

        {state.loading && <GpkgPlacementDialogLoading />}

        <GpkgPlacementDialogAlert error={state.error} />

        {metadataReady && !hasImportableLayers && (
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary'
            }}
          >
            В этом GeoPackage нет векторных таблиц (FEATURES) и растровых наборов (TILES).
          </Typography>
        )}

        {metadataReady && hasImportableLayers && simpleView && (
          <>
            {state.simpleImport ? (
              <GpkgPlacementDialogImportStatus simpleImport={state.simpleImport} />
            ) : (
              <GpkgPlacementDialogDestination groupName={file?.name ?? ''} />
            )}
            {(!state.simpleImport || state.simpleImport.status !== 'running') && (
              <GpkgPlacementDialogViewLink onClick={handleSelectLayers}>Выбрать слои</GpkgPlacementDialogViewLink>
            )}
          </>
        )}

        {metadataReady && hasImportableLayers && !simpleView && (
          <GpkgPlacementDialogTable
            key={state.metadata?.id}
            data={tableRows}
            selectedItems={state.selectedLayers}
            onSelect={handleLayersSelected}
          />
        )}
      </DialogContent>

      <DialogActions>
        {footerImport && (
          <ActionsLeft>
            <GpkgPlacementDialogImportStatus simpleImport={footerImport} footer />
          </ActionsLeft>
        )}
        <ActionsRight>
          {metadataReady &&
            hasImportableLayers &&
            (!simpleView || !state.simpleImport) &&
            (simpleView || selectionImportable) && (
              <GpkgPlacementDialogImportAction
                composition={composition}
                loading={state.bulkVectorOpen || state.bulkRasterOpen}
                onClick={handleOpenBulkPlacement}
              />
            )}
          <Button onClick={handleClose}>Закрыть</Button>
        </ActionsRight>
      </DialogActions>

      <GpkgVectorTablePlacementDialog
        open={state.bulkVectorOpen}
        autoDatasetExists={state.autoDatasetExists}
        onClose={handleCloseBulkVector}
        onPlace={handleBulkVectorPlace}
      />
      <GpkgRasterPlacementDialog
        open={state.bulkRasterOpen}
        onClose={handleCloseBulkRaster}
        onPlace={handleBulkRasterPlace}
      />
    </Dialog>
  );
});
