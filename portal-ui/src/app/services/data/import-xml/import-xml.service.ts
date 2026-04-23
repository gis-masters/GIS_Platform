import { isAxiosError } from '../../util/typeGuards/isAxiosError';
import { importXmlClient } from './import-xml.client';

export async function importXml(file: File, datasetIdentifier: string, tableIdentifier: string): Promise<number> {
  const formData = new FormData();

  formData.append('datasetId', datasetIdentifier);
  formData.append('tableId', tableIdentifier);
  formData.append('file', file);
  formData.append('importType', 'mp');

  try {
    return await importXmlClient.import(file, datasetIdentifier, tableIdentifier);
  } catch (error) {
    const msg = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;

    throw new Error(msg ?? 'Ошибка импорта XML', { cause: error });
  }
}
