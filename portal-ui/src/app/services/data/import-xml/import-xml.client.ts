import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';

@boundClass
class ImportXmlClient extends Client {
  private static _instance: ImportXmlClient;
  static get instance(): ImportXmlClient {
    return this._instance || (this._instance = new this());
  }

  private getApiImportXmlUrl(): string {
    return `${this.getDataUrl()}/import/file`;
  }

  async import(file: File, datasetIdentifier: string, tableIdentifier: string): Promise<number> {
    const formData = new FormData();
    formData.append('datasetId', datasetIdentifier);
    formData.append('tableId', tableIdentifier);
    formData.append('file', file);
    formData.append('importType', 'mp');

    return await http.post<number>(this.getApiImportXmlUrl(), formData);
  }
}

export const importXmlClient = ImportXmlClient.instance;
