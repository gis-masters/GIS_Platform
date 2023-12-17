import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { KptTaskInfo } from './kpt.models';

@boundClass
class Kpt extends Client {
  private static _instance: Kpt;

  static get instance(): Kpt {
    return this._instance || (this._instance = new this());
  }

  private getImportKptUrl(): string {
    return this.getDataUrl() + '/import/kpt';
  }

  async importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
    return http.post<KptTaskInfo>(this.getImportKptUrl(), importRequest);
  }
}

export const kpt = Kpt.instance;
