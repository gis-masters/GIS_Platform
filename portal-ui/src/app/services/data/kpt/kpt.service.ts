import { formatDate, systemFormat } from '../../util/date.util';
import { createFile } from '../files/files.service';
import { getFileBaseName } from '../files/files.util';
import { createLibraryRecord } from '../library/library.service';
import { kptClient } from './kpt.client';
import { KptTaskInfo, UploadKptData, UploadKptReturnType } from './kpt.models';

export async function importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
  return await kptClient.importKpt(importRequest);
}

export async function requestKpt(cadNums: string[]): Promise<void> {
  await kptClient.requestKpt(cadNums);
}

export async function uploadKpt({ file, data, libraryTableName }: UploadKptData): Promise<UploadKptReturnType> {
  const failedResult: UploadKptReturnType = { status: 'error' };
  const lastModified = new Date(file.file.lastModified);
  const dateOrder = formatDate(lastModified, systemFormat);

  try {
    const fileToLoad = await createFile(file.file);

    const { id, size, title } = fileToLoad;

    if (!fileToLoad) {
      return failedResult;
    }

    data.file = [{ id, size, title }];
    data.content_type_id = 'Карточка';
    data.date_order_completion = dateOrder;
    data.title = getFileBaseName(title);

    const libraryRecord = await createLibraryRecord(data, libraryTableName);

    if (!libraryRecord) {
      return failedResult;
    }

    return { status: 'success', libraryRecord };
  } catch {
    return failedResult;
  }
}
