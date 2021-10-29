import { http } from '../http.service';
import { wsService } from '../ws.service';
import { Process } from '../models';
import { getProcessesUrl } from '../server-urls.service';

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

interface ProcessDataModel {
  wsUiId: string;
  source: {
    libraryId: string;
    objectId: number;
  };
  target: {
    projectId: number;
    projectName: string;
    projectIsNew: boolean;
  };
}

export async function initImportProcess(
  libraryId: string,
  objectId: string,
  projectId: number | undefined,
  projectName: string,
  projectIsNew: boolean
): Promise<Process> {
  const payload: ProcessDataModel = {
    wsUiId: wsService.getId(),
    source: {
      libraryId: libraryId,
      objectId: Number(objectId)
    },
    target: {
      projectId: projectId,
      projectName: projectName,
      projectIsNew: projectIsNew
    }
  };

  return http.post<Process>(await getProcessesUrl(), JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' }
  });
}
