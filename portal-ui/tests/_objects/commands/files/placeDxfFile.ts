import { FileInfo } from '../../../../src/app/services/data/files/files.models';
import { processesClient } from '../../../../src/app/services/data/processes/processes.client';
import { ProcessType } from '../../../../src/app/services/data/processes/processes.models';
import { generateRandomId } from '../../../../src/app/services/util/randomId';
import { requestAsAdmin } from '../requestAs';

export async function placeDxfFile(fileInfo: FileInfo, projectId: number, crs: string): Promise<void> {
  const model = {
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: generateRandomId(),
      fileId: fileInfo.id,
      projectId,
      crs
    }
  };

  await requestAsAdmin(processesClient.createProcess, model);
}
