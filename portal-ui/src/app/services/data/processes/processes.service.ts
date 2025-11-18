import { type PageOptions } from '../../models';
import { sleep } from '../../util/sleep';
import { type SearchRequest } from '../search/search.model';
import { processesClient } from './processes.client';
import { type Process, type ProcessableModel, type ProcessResponse, ProcessStatus } from './processes.models';

export async function getProcess(id: number): Promise<Process> {
  return await processesClient.getProcess(id);
}

export async function createProcess(model: ProcessableModel): Promise<ProcessResponse> {
  return await processesClient.createProcess(model);
}

export async function createFileProcess(model: FormData): Promise<ProcessResponse> {
  return processesClient.createFileProcess(model);
}

export async function createSearchProcess(
  searchRequest: SearchRequest,
  pageOptions: PageOptions
): Promise<ProcessResponse> {
  return processesClient.createSearchProcess(searchRequest, pageOptions);
}

export async function awaitProcess(id: number, i = 0): Promise<void | Process> {
  if (i === 600) {
    // ждем 10 минут для предотвращения бесконечной загрузки

    return;
  }

  await sleep(1000);

  const res = await processesClient.getProcess(id);

  if (res.status === ProcessStatus.DONE || res.status === ProcessStatus.DONE_WITH_WARNINGS) {
    return res;
  }

  if (res.status === ProcessStatus.ERROR) {
    throw res;
  }

  return await awaitProcess(id, i + 1);
}
