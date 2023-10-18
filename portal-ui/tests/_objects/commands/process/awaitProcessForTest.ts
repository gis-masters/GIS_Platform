import { Process, ProcessStatus } from '../../../../src/app/services/data/processes/processes.models';
import { processesClient } from '../../../../src/app/services/data/processes/processes.client';
import { sleep } from '../../../../src/app/services/util/sleep';
import { requestAsAdmin } from '../requestAs';

export async function awaitProcessForTest(id: number, i = 0): Promise<void | Process> {
  if (i === 600) {
    return;
  }

  await sleep(1000);

  const res = await requestAsAdmin(processesClient.getProcess, id);

  if (res.status === ProcessStatus.DONE) {
    return res;
  }

  if (res.status === ProcessStatus.ERROR) {
    throw res;
  }

  return await awaitProcessForTest(id, i + 1);
}
