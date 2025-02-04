import { FileInfo } from '../../../../src/app/services/data/files/files.models';
import { processesClient } from '../../../../src/app/services/data/processes/processes.client';
import { ProcessType } from '../../../../src/app/services/data/processes/processes.models';
import { generateRandomId } from '../../../../src/app/services/util/randomId';
import { awaitProcessForTest } from '../process/awaitProcessForTest';
import { requestAsAdmin } from '../requestAs';

export async function placeFile(fileInfo: FileInfo, projectId: number, crs: string): Promise<void> {
  const model = {
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: generateRandomId(),
      fileId: fileInfo.id,
      projectId,
      crs
    }
  };

  const response = await requestAsAdmin(processesClient.createProcess, model);

  await awaitProcessForTest(Number(response._links.process.href.split('/').at(-1)));
}
