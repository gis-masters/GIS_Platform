import { http } from '../http.service';
import { wsService } from '../ws.service';
import { Process, ProcessType } from '../models';
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

export interface WsImportGmlModel {
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
  type: ProcessType;
  payload: {};
}

export async function initImportGmlProcess(
  libraryId: string,
  objectId: string,
  projectId: number | undefined,
  projectName: string,
  projectIsNew: boolean
): Promise<Process> {
  const data: ProcessDataModel = {
    type: ProcessType.IMPORT_GML,
    payload: {
      wsUiId: wsService.getId(),
      libraryId: libraryId,
      objectId: Number(objectId),
      projectId: projectId,
      projectName: projectName,
      projectIsNew: projectIsNew
    }
  };

  return http.post<Process>(await getProcessesUrl(), JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
