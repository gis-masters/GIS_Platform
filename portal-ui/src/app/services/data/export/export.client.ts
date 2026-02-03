import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { type Process } from '../processes/processes.models';
import { type ExportGpkgRequest, type ExportRequest } from './export.models';

@boundClass
class ExportClient extends Client {
  private static _instance: ExportClient;
  static get instance(): ExportClient {
    return this._instance || (this._instance = new this());
  }

  private getExportUrl(): string {
    return this.getDataUrl() + '/export';
  }

  async export(payload: ExportRequest | ExportGpkgRequest): Promise<Process> {
    return http.post<Process>(this.getExportUrl(), JSON.stringify(payload), {
      headers: { 'Content-Type': Mime.JSON }
    });
  }

  getDownloadUrl(fileName: string): string {
    return this.getExportUrl() + '/' + encodeURIComponent(fileName);
  }
}

export const exportClient = ExportClient.instance;
