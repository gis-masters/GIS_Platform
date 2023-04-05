import { http } from '../../api/http.service';
import { getApiImportXmlUrl } from '../../api/server-urls.service';

export async function _reqImportXml(file: File, datasetIdentifier: string, tableIdentifier: string): Promise<number> {
  const formData = new FormData();
  formData.append('datasetId', datasetIdentifier);
  formData.append('tableId', tableIdentifier);
  formData.append('file', file);
  formData.append('importType', 'mp');

  return await http.post<number>(await getApiImportXmlUrl(), formData);
}
