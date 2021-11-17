import { http } from '../http.service';
import { getDocumentLibraryIntegrationUrl } from '../server-urls.service';

export async function sendToSed(lidraryid: string, id: string): Promise<void> {
  await http.post(await getDocumentLibraryIntegrationUrl(lidraryid, id), {
    type: 'SED'
  });
}
