import { ProcessType } from '../models';
import { wsService } from '../ws.service';

import { FileInfo } from './files.service';
import { createProcess, ProcessResponse } from './processes.service';

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
