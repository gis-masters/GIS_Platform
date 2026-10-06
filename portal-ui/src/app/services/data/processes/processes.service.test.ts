import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('../../util/sleep', () => ({
  sleep: jest.fn(() => Promise.resolve())
}));

jest.mock('./processes.client', () => ({
  processesClient: {
    getProcess: jest.fn()
  }
}));

import { processesClient } from './processes.client';
import { type Process, ProcessStatus, ProcessType } from './processes.models';
import { awaitProcess } from './processes.service';

const getProcessMock = jest.mocked(processesClient.getProcess);

function processWith(status: ProcessStatus): Process {
  return {
    id: 7,
    userName: 'user',
    title: 'import',
    status,
    type: ProcessType.IMPORT,
    extra: undefined,
    details: { layerName: '', status, error: '' }
  };
}

function axiosFailure(status?: number): Error {
  return Object.assign(new Error('request failed'), {
    isAxiosError: true,
    name: 'AxiosError',
    response: status == null ? undefined : { status }
  });
}

describe('awaitProcess', () => {
  beforeEach(() => {
    getProcessMock.mockReset();
  });

  test('после 5xx продолжает опрос и возвращает завершённый процесс', async () => {
    const done = processWith(ProcessStatus.DONE);
    getProcessMock.mockRejectedValueOnce(axiosFailure(503)).mockResolvedValueOnce(done);

    await expect(awaitProcess(7)).resolves.toBe(done);
    expect(getProcessMock).toHaveBeenCalledTimes(2);
  });

  test('после обрыва сети продолжает опрос', async () => {
    const done = processWith(ProcessStatus.DONE);
    getProcessMock.mockRejectedValueOnce(axiosFailure()).mockResolvedValueOnce(done);

    await expect(awaitProcess(7)).resolves.toBe(done);
    expect(getProcessMock).toHaveBeenCalledTimes(2);
  });

  test('404 не считается временным сбоем', async () => {
    getProcessMock.mockRejectedValueOnce(axiosFailure(404));

    await expect(awaitProcess(7)).rejects.toThrow('request failed');
    expect(getProcessMock).toHaveBeenCalledTimes(1);
  });

  test('серия временных сбоев упирается в лимит ожидания', async () => {
    getProcessMock.mockRejectedValue(axiosFailure(502));

    await expect(awaitProcess(7)).rejects.toThrow('Процесс 7 не завершился за 10 минут');
    expect(getProcessMock).toHaveBeenCalledTimes(600);
  });
});
