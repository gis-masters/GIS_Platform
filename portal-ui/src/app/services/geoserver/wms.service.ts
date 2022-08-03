import { http } from '../http.service';

// TODO:
// import { getWmsUrl } from '../server-urls.service';

export async function getMap(url: string): Promise<Blob> {
  return await http.get<Blob>(url, { responseType: 'blob', cache: { disabled: true } });
}
