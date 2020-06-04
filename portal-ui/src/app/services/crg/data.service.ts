import { services } from '../services';
import { serverProperties } from '../server-properties.service';
import { CrgSource } from './projects.models';

export async function getSourceInfo(schemaName: string, tableName: string): Promise<CrgSource> {
  const url = `${await serverProperties.dataServerUrl}/schemas/${schemaName}/tables/${tableName}`;

  return services.httpq.get<CrgSource>(url).catch(() => null);
}
