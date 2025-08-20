import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { Process } from '../processes/processes.models';
import { ExportRequest } from './export.models';

@boundClass
class ExportClient extends Client {
  private static _instance: ExportClient;
  static get instance(): ExportClient {
    return this._instance || (this._instance = new this());
  }

  private getExportUrl(): string {
    return this.getDataUrl() + '/export';
  }

  async export(payload: ExportRequest): Promise<Process> {
    return http.post<Process>(this.getExportUrl(), JSON.stringify(payload), {
      headers: { 'Content-Type': Mime.JSON }
    });
  }

  async download(fileName: string): Promise<Blob> {
    return http.get(this.getExportUrl() + '/' + fileName, { responseType: 'blob' });
  }
}

export const exportClient = ExportClient.instance;
