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

  async getSchemaAtUrl(url: string): Promise<OldSchema> {
    return http.get<OldSchema>(url);
  }

  async getSchema(schemaIds: string[]): Promise<(OldSchema | null)[]> {
    const params = { schemaIds: schemaIds.join(',') };

    return await http.get<(OldSchema | null)[]>(this.getSchemaUrl(), { params });
  }

  async createSchema(schema: OldSchema): Promise<OldSchema> {
    return http.post<OldSchema>(this.getSchemaUrl(), schema);
  }

  async updateSchema(schema: OldSchema): Promise<OldSchema> {
    return http.put<OldSchema>(this.getSchemaUrl(), schema);
  }
}

export const schemaClient = SchemaClient.instance;
