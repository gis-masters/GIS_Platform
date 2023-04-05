import { http } from '../api/http.service';
import { getDocumentLibraryIntegrationUrl } from '../api/server-urls.service';

export async function _reqSendToSed(libraryTableName: string, recordId: number): Promise<void> {
  return http.post(await getDocumentLibraryIntegrationUrl(libraryTableName, recordId), {
    type: 'SED'
  });
}
