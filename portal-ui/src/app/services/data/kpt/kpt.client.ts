import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { KptRequestInfo, KptTaskInfo } from './kpt.models';

@boundClass
class Kpt extends Client {
  private static _instance: Kpt;

  static get instance(): Kpt {
    return this._instance || (this._instance = new this());
  }

  private getImportKptUrl(): string {
    return this.getDataUrl() + '/import/kpt';
  }

  private getRequestKptUrl(): string {
    return (
      this.getDataUrl() +
      '/integration/smev3/request/egrn?requestFilename=request.xml&appFilename=app_1.xml&passportFilename=Pasport_Semenov.pdf&archiveFilename=Request.zip'
    );
  }

  async getLibraryRecord(): Promise<KptRequestInfo> {
    return http.get<KptRequestInfo>(this.getRequestKptUrl());
  }

  async importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
    return http.post<KptTaskInfo>(this.getImportKptUrl(), importRequest);
  }
}

export const kpt = Kpt.instance;
