import { services } from '../services';
import { CrgSource } from './projects.models';
import { serverProperties } from '../server-properties.service';

export async function getSourceInfo(uri: string): Promise<CrgSource> {
  const url = `${await serverProperties.baseUrl}${uri}`;

  return services.httpq.get<CrgSource>(url).catch(() => null);
}
