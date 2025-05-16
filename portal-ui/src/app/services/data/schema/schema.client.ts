import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { OldSchema } from './schemaOld.models';

@boundClass
class SchemaClient extends Client {
  private static _instance: SchemaClient;
  static get instance(): SchemaClient {
    return this._instance || (this._instance = new this());
  }

  private getSchemaUrl(): string {
    return this.getDataUrl() + '/schemas';
  }

  private getTablesSchemasUrl(): string {
    return this.getDataUrl() + '/tablesSchemas';
  }

  async getSchemaAtUrl(url: string): Promise<OldSchema> {
    return http.get<OldSchema>(url);
  }

  async getSchema(schemaIds: string[]): Promise<(OldSchema | null)[]> {
    const params = { schemaIds: schemaIds.join(',') };

    return await http.get<(OldSchema | null)[]>(this.getSchemaUrl(), { params });
  }

  async getTableSchemas(tableIdentifiers: string[]): Promise<Map<string, OldSchema>> {
    const response = await http.post<Record<string, OldSchema>>(this.getTablesSchemasUrl(), tableIdentifiers);

    return new Map<string, OldSchema>(Object.entries(response));
  }

  async createSchema(schema: OldSchema): Promise<OldSchema> {
    return http.post<OldSchema>(this.getSchemaUrl(), schema);
  }

  async updateSchema(schema: OldSchema): Promise<OldSchema> {
    return http.put<OldSchema>(this.getSchemaUrl(), schema);
  }
}

export const schemaClient = SchemaClient.instance;
