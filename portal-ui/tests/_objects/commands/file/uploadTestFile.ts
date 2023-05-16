import fs from 'fs/promises';
import path from 'node:path';
import { File } from 'web-file-polyfill';

import { requestAsAdmin } from '../requestAs';
import { filesClient } from '../../../../src/app/services/data/files/files.client';
import { FileInfo } from '../../../../src/app/services/data/files/files.models';

export async function uploadTestFile(fileName: string): Promise<FileInfo> {
  const fileBuffer = await fs.readFile(path.join(__dirname, '..', '..', '..', '_files', fileName));
  const file = new File([new Blob([fileBuffer])], fileName);

  const result = await requestAsAdmin(filesClient.createFile, file);

  return result[0];
}
