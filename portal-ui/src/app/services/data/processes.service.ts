import { http } from '../http.service';
import { wsService } from '../ws.service';
import { Process, ProcessStatus } from '../models';
import { getProcessesUrl, getProcessUrl } from '../server-urls.service';
import { sleep } from '../util/sleep';
import { Mime } from '../util/Mime';

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
export interface ProcessDataModel {
  wsUiId: string;
  source: {
    libraryId: string;
    objectId: number;
  };
  target: {
    projectId: number;
    projectName: string;
    projectIsNew: boolean;
    mode?: string;
  };
}

export async function initImportProcess(
  libraryId: string,
  objectId: number,
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

export async function awaitProcess(url: string, i = 0): Promise<void> {
  if (i === 600) {
    // ждем 10 минут для предотвращения бесконечной загрузки

    return;
  }

  await sleep(1000);

  const res = await http.get<Process>(url, {
    cache: { disabled: true }
  });

  if (res.status === ProcessStatus.DONE) {
    return;
  }

  i++;
  await awaitProcess(url, i);
}

export async function createProcess(payload: ProcessDataModel): Promise<ProcessResponse> {
  return http.post<ProcessResponse>(await getProcessesUrl(), JSON.stringify(payload), {
    headers: { 'Content-Type': Mime.JSON }
  });
}

export async function getProcess(id: number): Promise<Process> {
  const url = await getProcessUrl(id);

  return http.get<Process>(url, {
    cache: { disabled: true }
  });
}
