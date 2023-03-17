import { sleep } from '../../util/sleep';

import { Process, ProcessableModel, ProcessResponse, ProcessStatus } from './processes.models';
import { _reqCreateFileProcess, _reqCreateProcess, _reqGetProcess } from './processes.client';

export async function getProcess(id: number): Promise<Process> {
  return await _reqGetProcess(id);
}

export async function createProcess(model: ProcessableModel): Promise<ProcessResponse> {
  return await _reqCreateProcess(model);
}

export async function createFileProcess(model: FormData): Promise<ProcessResponse> {
  return _reqCreateFileProcess(model);
}

export async function awaitProcess(id: number, i = 0): Promise<void | Process> {
  if (i === 600) {
    // ждем 10 минут для предотвращения бесконечной загрузки

    return;
  }

  await sleep(1000);

  const res = await _reqGetProcess(id);

  if (res.status === ProcessStatus.DONE) {
    return res;
  }

  if (res.status === ProcessStatus.ERROR) {
    throw res;
  }

  return await awaitProcess(id, i + 1);
}
