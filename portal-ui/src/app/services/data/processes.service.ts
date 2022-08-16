import { http } from '../http.service';
import { Process, ProcessStatus, ProcessType } from '../models';
import { getProcessesUrl, getProcessUrl } from '../server-urls.service';
import { sleep } from '../util/sleep';
import { Mime } from '../util/Mime';

import { PlacementModel } from './file-placement.service';

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
  payload: PlacementModel;
  type: ProcessType;
}

export async function createProcess(model: ProcessableModel): Promise<ProcessResponse> {
  return http.post<ProcessResponse>(await getProcessesUrl(), JSON.stringify(model), {
    headers: { 'Content-Type': Mime.JSON }
  });
}

export async function getProcess(id: number): Promise<Process> {
  const url = await getProcessUrl(id);

  return http.get<Process>(url, {
    cache: { disabled: true }
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
