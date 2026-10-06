import { type PageOptions, SortOrder } from '../../models';
import { sleep } from '../../util/sleep';
import { isAxiosError } from '../../util/typeGuards/isAxiosError';
import { isStringArray } from '../../util/typeGuards/isStringArray';
import { type SearchRequest } from '../search/search.model';
import { processesClient } from './processes.client';
import {
  type Process,
  type ProcessableModel,
  type ProcessResponse,
  ProcessStatus,
  ProcessType
} from './processes.models';

export async function getProcess(id: number): Promise<Process> {
  return await processesClient.getProcess(id);
}

export async function getRecentImportProcesses(): Promise<Process[]> {
  const page = await processesClient.getProcesses({
    page: 0,
    pageSize: 50,
    sort: 'id',
    sortOrder: SortOrder.DESC,
    queryParams: { type: ProcessType.IMPORT }
  });

  return page.content;
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

export function isTransientProcessPollError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return status == null || status >= 500;
}

export async function awaitProcess(id: number, i = 0): Promise<Process> {
  if (i === 600) {
    throw new Error(`Процесс ${id} не завершился за 10 минут`);
  }

  await sleep(1000);

  let res: Process;

  try {
    res = await processesClient.getProcess(id);
  } catch (error) {
    if (isTransientProcessPollError(error)) {
      return await awaitProcess(id, i + 1);
    }

    throw error;
  }

  if (res.status === ProcessStatus.DONE || res.status === ProcessStatus.DONE_WITH_WARNINGS) {
    return res;
  }

  if (res.status === ProcessStatus.ERROR) {
    throw new Error(getProcessErrorMessage(res), { cause: res });
  }

  return await awaitProcess(id, i + 1);
}

export function getProcessErrorMessage(process: Process): string {
  if (process.message) {
    return process.message;
  }

  const { details } = process;
  if (details !== null && typeof details === 'object') {
    if ('messages' in details && isStringArray(details.messages)) {
      const fromMessages = details.messages.filter(Boolean);
      if (fromMessages.length > 0) {
        return fromMessages.join('\n');
      }
    }

    if ('errorMessage' in details && typeof details.errorMessage === 'string' && details.errorMessage) {
      return details.errorMessage;
    }

    if ('error' in details && typeof details.error === 'string' && details.error) {
      return details.error;
    }
  }

  return `Процесс ${process.id} завершился с ошибкой`;
}
