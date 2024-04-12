import { createFile } from '../files/files.service';
import { createLibraryRecord } from '../library/library.service';
import { kptClient } from './kpt.client';
import { KptTaskInfo, UploadKptData, UploadKptReturnType } from './kpt.models';

export async function importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
  return await kptClient.importKpt(importRequest);
}

export async function requestKpt(order: string[]): Promise<void> {
  await kptClient.requestKpt(order);
}

export async function uploadKpt({ file, data, libraryTableName }: UploadKptData): Promise<UploadKptReturnType> {
  const failedResult: UploadKptReturnType = { status: 'error' };

  try {
    const fileToLoad = await createFile(file.file);

    const { id, size, title } = fileToLoad;

    if (!fileToLoad) {
      return failedResult;
    }

    data.file = [{ id, size, title }];

    const libraryRecord = await createLibraryRecord(data, libraryTableName);

    if (!libraryRecord) {
      return failedResult;
    }

    return { status: 'success', libraryRecord };
  } catch {
    return failedResult;
  }
}
