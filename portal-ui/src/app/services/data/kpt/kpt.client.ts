import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { KptTaskInfo } from './kpt.models';

@boundClass
class KptClient extends Client {
  private static _instance: KptClient;
  static get instance(): KptClient {
    return this._instance || (this._instance = new this());
  }

  private getImportKptUrl(): string {
    return this.getDataUrl() + '/import/kpt';
  }

  private getRequestKptUrl(): string {
    return this.getDataUrl() + '/integration/smev3/request/egrn';
  }

  async requestKpt(cadNums: string[]) {
    return http.post(this.getRequestKptUrl(), cadNums);
  }

  async importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
    return http.post<KptTaskInfo>(this.getImportKptUrl(), importRequest);
  }
}

export const kptClient = KptClient.instance;
