import { isObject } from 'lodash';

import { PageableResources } from '../../../../server-types/common-contracts';
import {
  GmlPlacementModel,
  ImportFeaturesFromShapeFileModel,
  PlacementModelForFilesWithCrs
} from '../file-placement/file-placement.models';

export interface Process {
  id: number;
  userName: string;
  title: string;
  status: ProcessStatus;
  type: ProcessType;
  extra: unknown;
  details: ProcessTasks | ImportShapeProcess | PageableResources<unknown> | PlaceFileProcess;
  message?: string;
}

export interface GeoserverPublicationData {
  workspaceName: string;
  storeName: string;
  featureTypeName: string;
  nativeName: string;
}

export interface PlaceFileProcess {
  geoserverPublicationData: GeoserverPublicationData;
}

export interface ProcessTasks {
  layerName: string;
  status: ProcessStatus;
  error: string;
}

export interface ImportShapeProcess extends ProcessTasks {
  errorMessage: string;
  warningMessage: string;
  quantityOfImportedRecords: number;
  quantityOfFailedRecords: number;
  shapeFileHasProjection: boolean;
  targetCrs: string;
}

// Править в соответствии с: src/main/java/ru/mycrg/data_service_contract/enums/ProcessType.java
export enum ProcessType {
  IMPORT = 'IMPORT',
  IMPORT_GML = 'IMPORT_GML',
  IMPORT_DXF = 'IMPORT_DXF',
  IMPORT_TAB = 'IMPORT_TAB',
  IMPORT_MID = 'IMPORT_MID',
  IMPORT_SHP = 'IMPORT_SHP',
  IMPORT_TIF = 'IMPORT_TIF',
  IMPORT_GEOMETRY = 'IMPORT_GEOMETRY',
  VALIDATION = 'VALIDATION',
  VALIDATION_REPORT = 'VALIDATION_REPORT',
  EXPORT = 'EXPORT'
}

// Править в соответствии с: ru/mycrg/common/enums/ProcessStatus.java
export enum ProcessStatus {
  PENDING = 'PENDING',

  TASK_DONE = 'TASK_DONE', // Завершена часть процесса (например: обработан один ресурс из нескольких)
  TASK_ERROR = 'TASK_ERROR', // Часть процесса завершилась неудачно

  DONE = 'DONE',
  ERROR = 'ERROR'
}

export interface ImportLayerReport {
  schemaId: string;
  successCount: number;
  failedCount: number;
  success: boolean;
  reason?: string;
  tableIdentifier?: string;
  tableTitle?: string;
  crs?: string;
}

export interface WsImportModel {
  id: string;
  description: string;
  payload: ImportResult;
  status: string;
  progress: number;
}

export interface ImportResult {
  datasetIdentifier: string;
  projectId: number;
  projectName: string;
  projectIsNew: boolean;
  importLayerReports: ImportLayerReport[];
  success: boolean;
  reason: string;
}

export interface ProcessResponse {
  _links: {
    process: { href: string };
  };
}

export interface ProcessableModel {
  type: ProcessType;
  payload: GmlPlacementModel | PlacementModelForFilesWithCrs | ImportFeaturesFromShapeFileModel;
}

export function isPlaceFileProcess(obj: unknown): obj is PlaceFileProcess {
  return (
    isObject(obj) &&
    'geoserverPublicationData' in obj &&
    typeof obj.geoserverPublicationData === 'object' &&
    isGeoserverPublicationData(obj.geoserverPublicationData)
  );
}

export function isGeoserverPublicationData(obj: unknown): obj is GeoserverPublicationData {
  return (
    isObject(obj) &&
    'workspaceName' in obj &&
    typeof obj.workspaceName === 'string' &&
    'storeName' in obj &&
    typeof obj.storeName === 'string' &&
    'featureTypeName' in obj &&
    typeof obj.featureTypeName === 'string' &&
    'nativeName' in obj &&
    typeof obj.nativeName === 'string'
  );
}
