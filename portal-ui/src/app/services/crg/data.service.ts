import { services } from '../services';
import { serverProperties } from '../server-properties.service';
import { CrgSource } from './projects.models';

export async function getSourceInfo(uri: string): Promise<CrgSource> {
  const url = `${await serverProperties.baseUrl}${uri}`;

  return services.httpq.get<CrgSource>(url).catch(() => null);
}
