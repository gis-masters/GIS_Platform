import { serverProperties } from '../server-properties.service';
import { CrgSource } from './projects.models';
import { http } from '../http.service';

export async function getSourceInfo(uri: string): Promise<CrgSource> {
  const url = `${await serverProperties.baseUrl}${uri}`;

  return http.get<CrgSource>(url).catch(() => null);
}
