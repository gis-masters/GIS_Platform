import { http } from '../http.service';
import { getDocumentLibraryIntegrationUrl } from '../server-urls.service';

export async function sendToSed(libraryId: string, id: string): Promise<void> {
  await http.post(await getDocumentLibraryIntegrationUrl(libraryId, id), {
    type: 'SED'
  });
}
