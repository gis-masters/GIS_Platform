import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { type SchemaTemplateWithOldSchema } from './schemaTemplate.models';

@boundClass
class SchemaTemplateClient extends Client {
  private static _instance: SchemaTemplateClient;
  static get instance(): SchemaTemplateClient {
    return this._instance || (this._instance = new this());
  }

  private getSchemasTemplateUrl(): string {
    return this.getDataUrl() + '/schemasTemplate';
  }

  async getSchemaTemplates(schemaIds: string[]): Promise<SchemaTemplateWithOldSchema[]> {
    const params = { schemaIds: schemaIds.join(',') };

    return await http.get<SchemaTemplateWithOldSchema[]>(this.getSchemasTemplateUrl(), { params });
  }
}

export const schemaTemplateClient = SchemaTemplateClient.instance;
