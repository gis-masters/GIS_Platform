import { ProcessType } from '../models';
import { wsService } from '../ws.service';

import { FileInfo } from './files.service';
import { createFileProcess, createProcess, ProcessResponse } from './processes.service';

export interface GmlPlacementModel {
  wsUiId: string;
  fileId: string;
  projectId: number;
  invertedCoordinates?: boolean;
}

export interface DfxPlacementModel {
  wsUiId: string;
  fileId: string;
  projectId: number;
  crs: string;
}

export interface ImportFeaturesFromShapeFileModel {
  datasetId: string;
  tableName: string;
  fileType: string;
}

export async function placeGml(
  fileInfo: FileInfo,
  projectId: number,
  invertedCoordinates: boolean
): Promise<ProcessResponse> {
  return createProcess({
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: wsService.getId(),
      fileId: fileInfo.id,
      projectId: projectId,
      invertedCoordinates: invertedCoordinates ?? undefined
    }
  });
}

export async function placeDxf(fileInfo: FileInfo, projectId: number, crs: string): Promise<ProcessResponse> {
  return createProcess({
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: wsService.getId(),
      fileId: fileInfo.id,
      projectId,
      crs
    }
  });
}

export async function importFeaturesFromShapeFile(
  shape: File,
  datasetId: string,
  tableName: string
): Promise<ProcessResponse> {
  const data = new FormData();

  data.append('file', shape, shape.name);
  data.append(
    'processModelJson',
    JSON.stringify({
      type: ProcessType.IMPORT_GEOMETRY,
      payload: {
        datasetId: datasetId,
        tableName: tableName,
        fileType: 'GEOMETRY_FROM_SHAPE'
      }
    })
  );

  return createFileProcess(data);
}
