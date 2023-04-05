import { http } from '../../api/http.service';
import { getSchemaUrl } from '../../api/server-urls.service';

import { OldSchema } from './schemaOld.models';

export async function _reqGetSchemaAtUrl(url: string): Promise<OldSchema> {
  return http.get<OldSchema>(url);
}

export async function _reqGetSchema(schemaIds: string[]): Promise<(OldSchema | null)[]> {
  const params = { schemaIds: schemaIds.join(',') };

  return await http.get<(OldSchema | null)[]>(await getSchemaUrl(), { params });
}

export async function _reqCreateSchema(schema: OldSchema): Promise<OldSchema> {
  return http.post<OldSchema>(await getSchemaUrl(), schema);
}

export async function _reqUpdateSchema(schema: OldSchema): Promise<OldSchema> {
  return http.put<OldSchema>(await getSchemaUrl(), schema);
}
