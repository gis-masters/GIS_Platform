import { ProcessType } from '../models';
import { wsService } from '../ws.service';

import { isGmlFile } from './files.util';
import { FileInfo } from './files.service';
import { createProcess, ProcessResponse } from './processes.service';

export interface PlacementModel {
  payload: FilePlacementModel;
  type: ProcessType;
}

export interface FilePlacementModel {
  wsUiId: string;
  fileId: string;
  projectId: number;
  invertedCoordinates?: boolean;
}

export async function placeFile(
  fileInfo: FileInfo,
  projectId: number,
  invertedCoordinates = false
): Promise<ProcessResponse> {
  let type: ProcessType;
  if (isGmlFile(fileInfo)) {
    type = ProcessType.IMPORT_GML;
  }

  if (!type) {
    throw new Error(`Не поддерживаемый тип файла: ${fileInfo.title}`);
  }

  return createProcess({
    type: ProcessType.IMPORT,
    payload: {
      type,
      payload: {
        wsUiId: wsService.getId(),
        fileId: fileInfo.id,
        projectId: projectId,
        invertedCoordinates
      }
    }
  });
}
