import { AxiosError } from 'axios';

import { _reqImportXml } from './import-xml.client';

export async function importXml(file: File, datasetIdentifier: string, tableIdentifier: string): Promise<number> {
  const formData = new FormData();

  formData.append('datasetId', datasetIdentifier);
  formData.append('tableId', tableIdentifier);
  formData.append('file', file);
  formData.append('importType', 'mp');

  try {
    return await _reqImportXml(file, datasetIdentifier, tableIdentifier);
  } catch (error) {
    throw new Error((error as AxiosError<{ message: string }>).response?.data?.message);
  }
}
