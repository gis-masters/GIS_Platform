import { http } from '../http.service';
import { getDocumentLibraryIntegrationUrl } from '../server-urls.service';

export async function sendToSed(libraryTableName: string, recordId: number): Promise<void> {
  await http.post(await getDocumentLibraryIntegrationUrl(libraryTableName, recordId), {
    type: 'SED'
  });
}
