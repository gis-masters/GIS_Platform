import { http } from '../http.service';
import { getDocumentLibraryIntegrationUrl } from '../server-urls.service';

export async function sendToSed(libraryId: string, recordId: number): Promise<void> {
  await http.post(await getDocumentLibraryIntegrationUrl(libraryId, recordId), {
    type: 'SED'
  });
}
