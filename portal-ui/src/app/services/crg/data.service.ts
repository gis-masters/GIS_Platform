import { services } from '../services';
import { serverProperties } from '../server-properties.service';
import { CrgSource } from './projects.models';

export interface RoleAssignmentBody {
  role: string;
  principalType: string;
  principalId: number;
}

export async function getSourceInfo(uri: string): Promise<CrgSource> {
  const url = `${await serverProperties.baseUrl}${uri}`;

  return services.httpq.get<CrgSource>(url).catch(() => null);
}

export async function setPermission(schemaName: string, tableName: string, payload: RoleAssignmentBody): Promise<any> {
  const url = `${await serverProperties.dataServerUrl}/schemas/${schemaName}/tables/${tableName}/roleAssignment`;

  return services.httpq.post(url, payload).catch(() => null);
}
