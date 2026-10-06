import { createElement, type ReactNode } from 'react';
import { reaction } from 'mobx';
import { isObject } from 'lodash';
import { v4 as uuid } from 'uuid';

import { GpkgImportToast, type GpkgImportToastItem } from '../../../components/GpkgImportToast/GpkgImportToast';
import { GpkgImportToastDetails } from '../../../components/GpkgImportToastDetails/GpkgImportToastDetails';
import { Toast } from '../../../components/Toast/Toast';
import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { type GpkgImportRecord, gpkgImportStore, isSettledStatus } from '../../../stores/GpkgImport.store';
import { communicationService } from '../../communication.service';
import { projectsService } from '../../gis/projects/projects.service';
import { sleep } from '../../util/sleep';
import { isArray } from '../../util/typeGuards/isArray';
import { isAxiosError } from '../../util/typeGuards/isAxiosError';
import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';
import { isStringArray } from '../../util/typeGuards/isStringArray';
import { deleteFile } from '../files/files.service';
import { type Process, ProcessStatus } from '../processes/processes.models';
import {
  awaitProcess,
  getProcess,
  getProcessErrorMessage,
  getRecentImportProcesses,
  isTransientProcessPollError
} from '../processes/processes.service';
import { type GpkgRasterLayerPlacement } from './file-placement.models';
import { placeGpkg } from './file-placement.service';
import {
  formatGpkgReportIssues,
  type GpkgReportIssue,
  readGpkgFailedLayerNames,
  readGpkgReportIssues
} from './gpkg-report';

type StartPlacementParams = {
  fileId: string;
  tableName: string;
  payloadIndex: number;
  vectorLayers?: string[];
  rasterLayers?: GpkgRasterLayerPlacement[];
  datasetIdentifier?: string;
  layerGroupId?: number;
};

function getImportErrorMessage(err: unknown): string {
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

  return 'Не удалось разместить слой';
}

async function deleteUploadedGpkg(fileId: string): Promise<void> {
  try {
    await deleteFile(fileId);
  } catch {
    // удаление исходного файла не должно ломать импорт
  }
}

async function deleteEmptyLayerGroup(layerGroupId?: number): Promise<void> {
  if (layerGroupId == null) {
    return;
  }

  if (gpkgImportStore.isGroupPlaced(layerGroupId) || gpkgImportStore.hasRunningInGroup(layerGroupId)) {
    return;
  }

  try {
    await projectsService.deleteGroup(layerGroupId);
  } catch {
    // пустая группа не должна маскировать ошибку импорта
  }
}

function readPlacedDatasetIdentifier(details: Process['details']): string | undefined {
  if (!isObject(details) || !('payload' in details) || !isObject(details.payload) || !('tables' in details.payload)) {
    return;
  }

  const { tables } = details.payload;
  if (!isArray(tables)) {
    return;
  }

  for (const table of tables) {
    if (isObject(table) && 'dataset' in table && typeof table.dataset === 'string' && table.dataset) {
      return table.dataset;
    }
  }

  return undefined;
}

type ImportSnapshot = GpkgImportToastItem & Pick<GpkgImportRecord, 'fileId' | 'toastVisible'>;

const filesWithToastDetails = new Set<string>();

const liveToastOptions = {
  loader: true,
  autoClose: false,
  closeButton: false,
  closeOnClick: false,
  draggable: false
} as const;

function snapshotImports(): ImportSnapshot[] {
  return gpkgImportStore.imports.map(item => ({
    id: item.id,
    fileId: item.fileId,
    tableName: item.tableName,
    features: item.features,
    tiles: item.tiles,
    toastVisible: item.toastVisible,
    status: item.status,
    error: item.error
  }));
}

function cohortOf(items: ImportSnapshot[]): ImportSnapshot[] {
  return items.filter(item => item.toastVisible || isSettledStatus(item.status));
}

function toToastItems(items: ImportSnapshot[]): GpkgImportToastItem[] {
  return items.map(({ id, tableName, features, tiles, status, error }) => ({
    id,
    tableName,
    features,
    tiles,
    status,
    error
  }));
}

function showLiveToast(fileId: string, several: boolean): void {
  const toastId = Toast.show({
    message: createElement(GpkgImportToast, { fileId }),
    details: several ? createElement(GpkgImportToastDetails, { fileId }) : undefined,
    ...liveToastOptions
  });

  gpkgImportStore.setFileToastId(fileId, toastId);

  if (several) {
    filesWithToastDetails.add(fileId);
  }
}

function attachToastDetails(fileId: string, toastId: string | number): void {
  Toast.update(toastId, {
    message: createElement(GpkgImportToast, { fileId }),
    details: createElement(GpkgImportToastDetails, { fileId }),
    ...liveToastOptions
  });
  filesWithToastDetails.add(fileId);
}

type SettledToastType = 'success' | 'warning' | 'error';

function settledToastType(cohort: ImportSnapshot[]): SettledToastType {
  if (cohort.some(item => item.status === 'error')) {
    return 'error';
  }

  if (cohort.some(item => item.status === 'warning')) {
    return 'warning';
  }

  return 'success';
}

function showSettledToast(
  type: SettledToastType,
  toastId: string | number | undefined,
  message: ReactNode,
  details: ReactNode
): void {
  if (type === 'error') {
    Toast.error({ message, details, toastId });

    return;
  }

  if (toastId == null) {
    if (type === 'warning') {
      Toast.warn({ message, details });
    } else {
      Toast.success({ message, details });
    }

    return;
  }

  Toast.update(toastId, {
    message,
    details,
    type,
    autoClose: Toast.defaultDuration
  });
}

function finalizeFileToast(fileId: string, cohort: ImportSnapshot[]): void {
  const toastId = gpkgImportStore.getFileToastId(fileId);
  const hadToastVisible = cohort.some(item => item.toastVisible);
  const items = toToastItems(cohort);
  const several = cohort.length > 1;
  const [only] = cohort;
  const details = several ? createElement(GpkgImportToastDetails, { items }) : undefined;

  if (cohort.length === 1 && only?.status === 'error') {
    const message = only.error ?? 'Не удалось разместить слой';

    if (toastId == null) {
      Toast.error(message);
    } else {
      Toast.error(message, { toastId });
    }
  } else {
    showSettledToast(settledToastType(cohort), toastId, createElement(GpkgImportToast, { items }), details);
  }

  filesWithToastDetails.delete(fileId);
  gpkgImportStore.clearFileToastId(fileId);
  cohort.forEach(item => {
    gpkgImportStore.remove(item.id);
  });

  if (hadToastVisible && !gpkgImportStore.hasImports(fileId)) {
    void deleteUploadedGpkg(fileId);
  }
}

function syncFileImports(fileId: string, items: ImportSnapshot[]): void {
  items
    .filter(item => item.status === 'done' && !item.toastVisible)
    .forEach(item => {
      gpkgImportStore.remove(item.id);
    });

  const cohort = cohortOf(items);
  const fileHasRunning = items.some(item => item.status === 'running');

  if (!fileHasRunning) {
    if (cohort.length > 0) {
      finalizeFileToast(fileId, cohort);
    }

    return;
  }

  if (cohort.length === 0) {
    return;
  }

  const toastId = gpkgImportStore.getFileToastId(fileId);

  if (toastId == null) {
    showLiveToast(fileId, cohort.length > 1);

    return;
  }

  if (cohort.length > 1 && !filesWithToastDetails.has(fileId)) {
    attachToastDetails(fileId, toastId);
  }
}

reaction(snapshotImports, items => {
  const byFile = new Map<string, ImportSnapshot[]>();

  items.forEach(item => {
    const group = byFile.get(item.fileId);

    if (group) {
      group.push(item);
    } else {
      byFile.set(item.fileId, [item]);
    }
  });

  byFile.forEach((group, fileId) => {
    syncFileImports(fileId, group);
  });

  gpkgImportStore.toastFileIds().forEach(fileId => {
    if (byFile.has(fileId)) {
      return;
    }

    const toastId = gpkgImportStore.getFileToastId(fileId);
    if (toastId != null) {
      Toast.dismiss(toastId);
    }

    gpkgImportStore.clearFileToastId(fileId);
    filesWithToastDetails.delete(fileId);
  });
});

type BeginPlacementParams = Omit<StartPlacementParams, 'datasetIdentifier'> & {
  payloadIndexes?: number[];
};

export type GpkgPlacementOutcome = {
  datasetIdentifier?: string;
  issues: GpkgReportIssue[];
};

export type GpkgPlacement = {
  run(datasetIdentifier?: string): Promise<GpkgPlacementOutcome>;
  hold(): void;
  abort(error?: unknown): void;
};

type PersistedGpkgImport = {
  intentId?: string;
  createdAt?: number;
  requestSent?: boolean;
  processId?: number;
  datasetIntentId?: string;
  datasetProcessId?: number;
  fileId: string;
  projectId: number;
  tableName: string;
  payloadIndex: number;
  payloadIndexes?: number[];
  features: number;
  tiles: number;
  layerGroupId?: number;
  vectorLayers?: string[];
  rasterLayers?: GpkgRasterLayerPlacement[];
  datasetIdentifier?: string;
};

const intentTtlMs = 20 * 60 * 1000;
const importLookupAttempts = 3;
const importLookupPauseMs = 1000;

const runningProcessStatuses = new Set<ProcessStatus>([
  ProcessStatus.PENDING,
  ProcessStatus.TASK_DONE,
  ProcessStatus.TASK_ERROR
]);

let resumeStarted = false;

function persistedImportsKey(): string {
  return `gpkgImports_${currentUser.orgId}_${currentUser.id}`;
}

function isRasterPlacement(value: unknown): value is GpkgRasterLayerPlacement {
  if (!isRecordStringUnknown(value)) {
    return false;
  }

  return (
    typeof value.gpkgLayerTableName === 'string' &&
    typeof value.libraryIdentifier === 'string' &&
    typeof value.documentId === 'number' &&
    typeof value.field === 'string'
  );
}

function isRasterPlacementList(value: unknown): value is GpkgRasterLayerPlacement[] {
  return isArray(value) && value.every(isRasterPlacement);
}

function isNumberArray(value: unknown): value is number[] {
  return isArray(value) && value.every(item => typeof item === 'number');
}

function isPersistedGpkgImport(value: unknown): value is PersistedGpkgImport {
  if (!isRecordStringUnknown(value)) {
    return false;
  }

  const hasProcess = typeof value.processId === 'number';
  const hasIntent = typeof value.intentId === 'string' && typeof value.createdAt === 'number';
  const vectorLayersOk = value.vectorLayers === undefined || isStringArray(value.vectorLayers);
  const rasterLayersOk = value.rasterLayers === undefined || isRasterPlacementList(value.rasterLayers);
  const pendingCanRetry = hasProcess || isStringArray(value.vectorLayers);

  return (
    (hasProcess || hasIntent) &&
    pendingCanRetry &&
    vectorLayersOk &&
    rasterLayersOk &&
    (value.processId === undefined || hasProcess) &&
    (value.intentId === undefined || typeof value.intentId === 'string') &&
    (value.createdAt === undefined || typeof value.createdAt === 'number') &&
    (value.requestSent === undefined || typeof value.requestSent === 'boolean') &&
    (value.datasetIntentId === undefined || typeof value.datasetIntentId === 'string') &&
    (value.datasetProcessId === undefined || typeof value.datasetProcessId === 'number') &&
    (value.datasetIdentifier === undefined || typeof value.datasetIdentifier === 'string') &&
    typeof value.fileId === 'string' &&
    typeof value.projectId === 'number' &&
    typeof value.tableName === 'string' &&
    typeof value.payloadIndex === 'number' &&
    (value.payloadIndexes === undefined || isNumberArray(value.payloadIndexes)) &&
    typeof value.features === 'number' &&
    typeof value.tiles === 'number' &&
    (value.layerGroupId === undefined || typeof value.layerGroupId === 'number')
  );
}

function readPersistedImports(): PersistedGpkgImport[] {
  const key = persistedImportsKey();
  const raw = localStorage.getItem(key);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isArray(parsed)) {
      localStorage.removeItem(key);

      return [];
    }

    const items = parsed.filter(isPersistedGpkgImport);
    if (items.length !== parsed.length) {
      writePersistedImports(items);
    }

    return items;
  } catch {
    localStorage.removeItem(key);

    return [];
  }
}

function writePersistedImports(items: PersistedGpkgImport[]): void {
  try {
    const key = persistedImportsKey();

    if (items.length === 0) {
      localStorage.removeItem(key);

      return;
    }

    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // сбой localStorage не должен прерывать импорт
  }
}

function rememberPendingIntent(id: string, intentId: string, params: StartPlacementParams, projectId: number): void {
  const item = gpkgImportStore.imports.find(record => record.id === id);
  if (!item) {
    return;
  }

  const next: PersistedGpkgImport = {
    intentId,
    createdAt: Date.now(),
    fileId: item.fileId,
    projectId,
    tableName: item.tableName,
    payloadIndex: item.payloadIndex,
    payloadIndexes: item.payloadIndexes,
    features: item.features,
    tiles: item.tiles,
    layerGroupId: item.layerGroupId,
    vectorLayers: params.vectorLayers ?? [params.tableName],
    rasterLayers: params.rasterLayers ?? [],
    datasetIdentifier: params.datasetIdentifier
  };

  writePersistedImports([...readPersistedImports().filter(stored => stored.intentId !== intentId), next]);
}

function attachProcessId(intentId: string, processId: number): void {
  writePersistedImports(
    readPersistedImports().map(item => {
      if (item.intentId === intentId) {
        return { ...item, processId };
      }

      if (item.datasetIntentId === intentId && item.datasetProcessId == null) {
        return { ...item, datasetProcessId: processId };
      }

      return item;
    })
  );
}

function isDeferredImport(item: PersistedGpkgImport): boolean {
  return item.requestSent === false && item.processId == null;
}

function findDatasetSourceIntent(fileId: string, projectId: number, layerGroupId?: number): string | undefined {
  return readPersistedImports().find(
    item =>
      Boolean(item.intentId) &&
      item.requestSent !== false &&
      item.fileId === fileId &&
      item.projectId === projectId &&
      item.layerGroupId === layerGroupId &&
      item.datasetIdentifier == null &&
      (item.vectorLayers?.length ?? 0) > 0
  )?.intentId;
}

function rememberHeldIntent(id: string, intentId: string, params: StartPlacementParams, projectId: number): void {
  const item = gpkgImportStore.imports.find(record => record.id === id);
  if (!item) {
    return;
  }

  const next: PersistedGpkgImport = {
    intentId,
    createdAt: Date.now(),
    requestSent: false,
    datasetIntentId: findDatasetSourceIntent(item.fileId, projectId, item.layerGroupId),
    fileId: item.fileId,
    projectId,
    tableName: item.tableName,
    payloadIndex: item.payloadIndex,
    payloadIndexes: item.payloadIndexes,
    features: item.features,
    tiles: item.tiles,
    layerGroupId: item.layerGroupId,
    vectorLayers: params.vectorLayers ?? [params.tableName],
    rasterLayers: params.rasterLayers ?? []
  };

  writePersistedImports([...readPersistedImports().filter(stored => stored.intentId !== intentId), next]);
}

function markIntentRequestSent(intentId: string, datasetIdentifier?: string): void {
  writePersistedImports(
    readPersistedImports().map(item =>
      item.intentId === intentId ? { ...item, requestSent: true, datasetIdentifier } : item
    )
  );
}

function forgetPersistedImport(processId: number): void {
  writePersistedImports(readPersistedImports().filter(item => item.processId !== processId));
}

function forgetPersistedIntent(intentId: string): void {
  writePersistedImports(readPersistedImports().filter(item => item.intentId !== intentId));
}

function dropStaleIntents(items: PersistedGpkgImport[]): PersistedGpkgImport[] {
  const sourceIntentIds = new Set(items.flatMap(item => (item.intentId ? [item.intentId] : [])));
  const fresh = items.filter(item => {
    if (item.processId != null) {
      return true;
    }

    if (item.createdAt != null && Date.now() - item.createdAt <= intentTtlMs) {
      return true;
    }

    if (!isDeferredImport(item)) {
      return false;
    }

    if (item.datasetIntentId && sourceIntentIds.has(item.datasetIntentId)) {
      return true;
    }

    return item.datasetProcessId != null;
  });

  if (fresh.length !== items.length) {
    writePersistedImports(fresh);
  }

  return fresh;
}

function persistedToAddPayload(
  item: PersistedGpkgImport,
  status: GpkgImportRecord['status'],
  error?: string,
  toastVisible = true
) {
  return {
    fileId: item.fileId,
    tableName: item.tableName,
    payloadIndex: item.payloadIndex,
    payloadIndexes: item.payloadIndexes,
    features: item.features,
    tiles: item.tiles,
    layerGroupId: item.layerGroupId,
    toastVisible,
    status,
    error
  };
}

function requestedLayerNames(
  vectorLayers: string[] | undefined,
  rasterLayers: GpkgRasterLayerPlacement[] | undefined,
  tableName: string
): string[] {
  return [...(vectorLayers ?? [tableName]), ...(rasterLayers ?? []).map(layer => layer.gpkgLayerTableName)];
}

function everyRequestedLayerFailed(issues: GpkgReportIssue[], requested: string[]): boolean {
  if (requested.length === 0) {
    return false;
  }

  const failed = readGpkgFailedLayerNames(issues);

  return requested.every(name => failed.has(name));
}

type GpkgSettledPlacement = {
  process: Process;
  issues: GpkgReportIssue[];
};

/**
 * Процесс импорта может завершиться со статусом DONE, хотя часть сущностей в отчёте
 * details.payload помечена ERROR. Учитываем отчёт при выставлении статуса импорта.
 */
async function applyPlacementOutcome(
  id: string,
  processId: number,
  layerGroupId: number | undefined,
  issues: GpkgReportIssue[],
  requested: string[]
): Promise<void> {
  forgetPersistedImport(processId);

  if (issues.length === 0) {
    communicationService.fileConnectionsUpdated.emit({ type: 'create', data: [] });
    if (layerGroupId != null) {
      gpkgImportStore.markGroupPlaced(layerGroupId);
    }

    gpkgImportStore.setStatus(id, 'done');

    return;
  }

  const message = formatGpkgReportIssues(issues);

  if (everyRequestedLayerFailed(issues, requested)) {
    gpkgImportStore.setStatus(id, 'error', message);
    await deleteEmptyLayerGroup(layerGroupId);

    return;
  }

  communicationService.fileConnectionsUpdated.emit({ type: 'create', data: [] });
  if (layerGroupId != null) {
    gpkgImportStore.markGroupPlaced(layerGroupId);
  }

  gpkgImportStore.setStatus(id, 'warning', message);
}

async function settlePlacement(
  id: string,
  processId: number,
  layerGroupId: number | undefined,
  dropEmptyGroup: boolean,
  requested: string[]
): Promise<GpkgSettledPlacement> {
  try {
    const process = await awaitProcess(processId);
    const issues = readGpkgReportIssues(process.details);
    await applyPlacementOutcome(id, processId, layerGroupId, issues, requested);

    return { process, issues };
  } catch (error) {
    gpkgImportStore.setStatus(id, 'error', getImportErrorMessage(error));
    forgetPersistedImport(processId);
    if (dropEmptyGroup) {
      await deleteEmptyLayerGroup(layerGroupId);
    }

    throw error;
  }
}

const missedImportMessage = 'Не удалось запустить импорт';
const uncheckedImportMessage = 'Не удалось проверить статус импорта';

function sameStrings(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const expected = left.toSorted((one, another) => one.localeCompare(another));
  const actual = right.toSorted((one, another) => one.localeCompare(another));

  return expected.every((value, index) => value === actual[index]);
}

function rasterKey(layer: GpkgRasterLayerPlacement): string {
  return `${layer.gpkgLayerTableName}\0${layer.libraryIdentifier}\0${layer.documentId}\0${layer.field}`;
}

function sameRasters(left: GpkgRasterLayerPlacement[], right: GpkgRasterLayerPlacement[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const expected = left.map(rasterKey).toSorted((one, another) => one.localeCompare(another));
  const actual = right.map(rasterKey).toSorted((one, another) => one.localeCompare(another));

  return expected.every((value, index) => value === actual[index]);
}

function placementMatches(item: PersistedGpkgImport, extra: unknown): boolean {
  if (!isRecordStringUnknown(extra) || typeof extra.fileId !== 'string' || typeof extra.projectId !== 'number') {
    return false;
  }

  if (extra.fileId !== item.fileId || extra.projectId !== item.projectId) {
    return false;
  }

  const placement = extra.layersPlacement;
  if (placement !== undefined && !isRecordStringUnknown(placement)) {
    return false;
  }

  const vectorLayers = placement && isStringArray(placement.vectorLayers) ? placement.vectorLayers : [];
  const rasterLayers = placement && isRasterPlacementList(placement.rasterLayers) ? placement.rasterLayers : [];
  const expectedVectors = item.vectorLayers ?? [item.tableName];
  const expectedRasters = item.rasterLayers ?? [];

  return sameStrings(expectedVectors, vectorLayers) && sameRasters(expectedRasters, rasterLayers);
}

function findMatchingProcess(item: PersistedGpkgImport, processes: Process[]): Process | undefined {
  const matches = processes.filter(process => placementMatches(item, process.extra));

  return matches.toSorted((left, right) => right.id - left.id)[0];
}

function takeMatchedIntents(unmatched: PersistedGpkgImport[], processes: Process[]): PersistedGpkgImport[] {
  const recovered: PersistedGpkgImport[] = [];

  for (let index = unmatched.length - 1; index >= 0; index--) {
    const item = unmatched[index];
    if (!item?.intentId) {
      continue;
    }

    const process = findMatchingProcess(item, processes);
    if (!process) {
      continue;
    }

    attachProcessId(item.intentId, process.id);
    recovered.push({ ...item, processId: process.id });
    unmatched.splice(index, 1);
  }

  return recovered;
}

function showPersistedError(item: PersistedGpkgImport, message: string, toastVisible: boolean): void {
  gpkgImportStore.add(persistedToAddPayload(item, 'error', message, toastVisible));
}

async function giveUpPendingIntents(items: PersistedGpkgImport[]): Promise<void> {
  const intentIds = new Set(items.flatMap(item => (item.intentId ? [item.intentId] : [])));
  writePersistedImports(readPersistedImports().filter(item => item.intentId == null || !intentIds.has(item.intentId)));
  items.forEach(item => {
    showPersistedError(item, missedImportMessage, true);
  });
  await Promise.all(items.map(item => deleteEmptyLayerGroup(item.layerGroupId)));
}

async function recoverPendingIntents(items: PersistedGpkgImport[]): Promise<PersistedGpkgImport[]> {
  const pending = items.filter(item => item.processId == null);
  const tracked = items.filter(item => item.processId != null);
  if (pending.length === 0) {
    return tracked;
  }

  const unmatched = [...pending];
  const recovered: PersistedGpkgImport[] = [];
  let listRead = false;

  for (let attempt = 0; attempt < importLookupAttempts && unmatched.length > 0; attempt++) {
    if (attempt > 0) {
      await sleep(importLookupPauseMs);
    }

    try {
      const processes = await getRecentImportProcesses();
      listRead = true;
      recovered.push(...takeMatchedIntents(unmatched, processes));
    } catch {
      // следующая попытка; если список так и не прочитался, запись остаётся
    }
  }

  if (!listRead) {
    unmatched.forEach(item => {
      showPersistedError(item, uncheckedImportMessage, false);
    });

    return [...tracked, ...recovered, ...unmatched];
  }

  await giveUpPendingIntents(unmatched);

  return [...tracked, ...recovered];
}

async function resumePersistedImport(item: PersistedGpkgImport): Promise<void> {
  const { processId } = item;
  if (processId == null) {
    return;
  }

  const id = gpkgImportStore.add(persistedToAddPayload(item, 'running'));
  const requested = requestedLayerNames(item.vectorLayers, item.rasterLayers, item.tableName);

  try {
    const process = await getProcess(processId);

    if (process.status === ProcessStatus.DONE || process.status === ProcessStatus.DONE_WITH_WARNINGS) {
      await applyPlacementOutcome(id, processId, item.layerGroupId, readGpkgReportIssues(process.details), requested);

      return;
    }

    if (process.status === ProcessStatus.ERROR) {
      forgetPersistedImport(processId);
      gpkgImportStore.setStatus(id, 'error', getProcessErrorMessage(process));

      return;
    }

    if (!runningProcessStatuses.has(process.status)) {
      forgetPersistedImport(processId);
      gpkgImportStore.remove(id);

      return;
    }

    try {
      await settlePlacement(id, processId, item.layerGroupId, false, requested);
    } catch {
      // ошибка уже записана в стор и показана тостом
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      forgetPersistedImport(processId);
      gpkgImportStore.remove(id);

      return;
    }

    if (isTransientProcessPollError(error)) {
      try {
        await settlePlacement(id, processId, item.layerGroupId, false, requested);
      } catch {
        // ошибка уже записана в стор и показана тостом
      }

      return;
    }

    gpkgImportStore.setStatus(id, 'error', getImportErrorMessage(error));
  }
}

function placementParamsFromPersisted(item: PersistedGpkgImport, datasetIdentifier: string): StartPlacementParams {
  return {
    fileId: item.fileId,
    tableName: item.tableName,
    payloadIndex: item.payloadIndex,
    vectorLayers: item.vectorLayers,
    rasterLayers: item.rasterLayers,
    datasetIdentifier,
    layerGroupId: item.layerGroupId
  };
}

function deferredSourceProcessId(item: PersistedGpkgImport, sources: PersistedGpkgImport[]): number | undefined {
  const source = sources.find(stored => stored.intentId === item.datasetIntentId);

  return source?.processId ?? item.datasetProcessId;
}

async function resumeDeferredImport(item: PersistedGpkgImport, processId: number | undefined): Promise<void> {
  const intentId = item.intentId;
  const id = gpkgImportStore.add(persistedToAddPayload(item, 'running'));

  if (processId == null || !intentId) {
    if (intentId) {
      forgetPersistedIntent(intentId);
    }

    gpkgImportStore.setStatus(id, 'error', missedImportMessage);

    return;
  }

  try {
    const finished = await awaitProcess(processId);
    const datasetIdentifier = readPlacedDatasetIdentifier(finished.details);
    if (!datasetIdentifier) {
      forgetPersistedIntent(intentId);
      gpkgImportStore.setStatus(id, 'error', missedImportMessage);

      return;
    }

    await runPlacement(id, placementParamsFromPersisted(item, datasetIdentifier), item.projectId, intentId);
  } catch (error) {
    forgetPersistedIntent(intentId);
    const record = gpkgImportStore.imports.find(stored => stored.id === id);
    if (record?.status === 'running') {
      gpkgImportStore.setStatus(id, 'error', getImportErrorMessage(error));
    }
  }
}

export async function resumePersistedGpkgImports(): Promise<void> {
  if (resumeStarted || !currentUser.id) {
    return;
  }

  resumeStarted = true;
  const stored = readPersistedImports();
  const deferredIds = new Set(stored.flatMap(item => (isDeferredImport(item) && item.intentId ? [item.intentId] : [])));
  const sent = stored.filter(item => item.intentId == null || !deferredIds.has(item.intentId));
  const recovered = await recoverPendingIntents(sent);
  const deferred = readPersistedImports().filter(item => item.intentId != null && deferredIds.has(item.intentId));
  const items = dropStaleIntents([...recovered, ...deferred]);
  const waiting = items.filter(isDeferredImport);
  const sources = items.filter(item => !isDeferredImport(item));

  await Promise.all([
    ...sources.filter(item => item.processId != null).map(item => resumePersistedImport(item)),
    ...waiting.map(item => resumeDeferredImport(item, deferredSourceProcessId(item, sources)))
  ]);
}

function isImportToastShown(id: string): boolean {
  const item = gpkgImportStore.imports.find(record => record.id === id);

  return Boolean(item && (item.toastVisible || gpkgImportStore.getFileToastId(item.fileId) != null));
}

async function runPlacement(
  id: string,
  params: StartPlacementParams,
  projectId: number,
  heldIntentId?: string
): Promise<GpkgPlacementOutcome> {
  const { fileId, tableName, vectorLayers, rasterLayers, datasetIdentifier, layerGroupId } = params;
  const intentId = heldIntentId ?? uuid();
  const held = heldIntentId != null && readPersistedImports().some(item => item.intentId === heldIntentId);

  try {
    if (held) {
      markIntentRequestSent(intentId, datasetIdentifier);
    } else {
      rememberPendingIntent(id, intentId, params, projectId);
    }
  } catch {
    // запись intent не должна прерывать размещение
  }

  try {
    const response = await placeGpkg({
      fileId,
      projectId,
      vectorLayers: vectorLayers ?? [tableName],
      rasterLayers,
      datasetIdentifier,
      layerGroupId
    });
    const processId = Number(response._links.process.href.split('/').at(-1));

    if (!Number.isInteger(processId)) {
      throw new TypeError('Не удалось определить процесс импорта');
    }

    attachProcessId(intentId, processId);
    const settled = await settlePlacement(
      id,
      processId,
      layerGroupId,
      true,
      requestedLayerNames(vectorLayers, rasterLayers, tableName)
    );

    return {
      datasetIdentifier: datasetIdentifier || readPlacedDatasetIdentifier(settled.process.details),
      issues: settled.issues
    };
  } catch (error) {
    forgetPersistedIntent(intentId);
    const item = gpkgImportStore.imports.find(record => record.id === id);
    if (item?.status === 'running') {
      gpkgImportStore.setStatus(id, 'error', getImportErrorMessage(error));
      await deleteEmptyLayerGroup(layerGroupId);
    }

    throw error;
  }
}

export function beginPlacement(params: BeginPlacementParams): GpkgPlacement {
  const { fileId, tableName, payloadIndex, payloadIndexes, vectorLayers, rasterLayers, layerGroupId } = params;
  const projectId = currentProject.id;
  const features = (vectorLayers ?? [tableName]).length;
  const tiles = rasterLayers?.length ?? 0;
  const id = gpkgImportStore.add({
    fileId,
    tableName,
    payloadIndex,
    payloadIndexes: payloadIndexes ?? [payloadIndex],
    features,
    tiles,
    layerGroupId
  });
  let started = false;
  let heldIntentId: string | undefined;
  const placementParams = { fileId, tableName, payloadIndex, vectorLayers, rasterLayers, layerGroupId };

  return {
    hold() {
      if (started || heldIntentId) {
        return;
      }

      const intentId = uuid();
      heldIntentId = intentId;

      try {
        rememberHeldIntent(id, intentId, placementParams, projectId);
      } catch {
        // запись intent не должна прерывать размещение
      }
    },
    run(datasetIdentifier) {
      started = true;

      return runPlacement(id, { ...placementParams, datasetIdentifier }, projectId, heldIntentId);
    },
    abort(error) {
      if (started) {
        return;
      }

      started = true;

      if (heldIntentId) {
        forgetPersistedIntent(heldIntentId);
      }

      if (isImportToastShown(id)) {
        gpkgImportStore.setStatus(id, 'error', getImportErrorMessage(error));
      } else {
        gpkgImportStore.remove(id);
      }

      void deleteEmptyLayerGroup(layerGroupId);
    }
  };
}

export async function startPlacement({
  datasetIdentifier,
  ...params
}: StartPlacementParams): Promise<GpkgPlacementOutcome> {
  return beginPlacement(params).run(datasetIdentifier);
}

type GpkgBulkLayer = {
  tableName: string;
  payloadIndex: number;
};

type GpkgRasterImportTarget = {
  libraryIdentifier: string;
  documentId: number;
  field: string;
};

type BeginBulkPlacementParams = {
  fileId: string;
  vectorLayers?: GpkgBulkLayer[];
  rasterLayers?: GpkgBulkLayer[];
  rasterTarget?: GpkgRasterImportTarget;
  layerGroupId?: number;
};

function toRasterLayerPlacements(layers: GpkgBulkLayer[], target: GpkgRasterImportTarget) {
  return layers.map(layer => ({
    gpkgLayerTableName: layer.tableName,
    libraryIdentifier: target.libraryIdentifier,
    documentId: target.documentId,
    field: target.field
  }));
}

/** Размещение без процесса импорта: запрос не уходит, отчёта и ошибок нет. */
function idlePlacement(): GpkgPlacement {
  return {
    run() {
      return Promise.resolve({ issues: [] }) as Promise<GpkgPlacementOutcome>;
    },
    hold() {
      // резерв не создавался
    },
    abort() {
      // резерв не создавался
    }
  };
}

export function beginBulkPlacement({
  fileId,
  vectorLayers = [],
  rasterLayers = [],
  rasterTarget,
  layerGroupId
}: BeginBulkPlacementParams): GpkgPlacement {
  const layers = [...vectorLayers, ...rasterLayers];
  const [first] = layers;
  if (!first || (rasterLayers.length > 0 && !rasterTarget)) {
    return idlePlacement();
  }

  return beginPlacement({
    fileId,
    tableName: layers.map(layer => layer.tableName).join(', '),
    payloadIndex: first.payloadIndex,
    payloadIndexes: layers.map(layer => layer.payloadIndex),
    vectorLayers: vectorLayers.map(layer => layer.tableName),
    rasterLayers: rasterTarget ? toRasterLayerPlacements(rasterLayers, rasterTarget) : [],
    layerGroupId
  });
}
