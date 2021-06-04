import { http } from './http.service';
import { getApiImportXmlUrl } from './server-urls.service';

export async function importXml(file: File, datasetId: string, tableId: string): Promise<number> {
  const formData = new FormData();

  formData.append('datasetId', datasetId);
  formData.append('tableId', tableId);
  formData.append('file', file);
  try {
    return await http.post<number>(await getApiImportXmlUrl(), formData);
  } catch (e) {
    throw new Error(e?.response?.data?.message);
  }
}
