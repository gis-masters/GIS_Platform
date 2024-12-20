import { boundClass } from 'autobind-decorator';

import { SpecializationView } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';

@boundClass
class SpecializationsClient extends Client {
  private static _instance: SpecializationsClient;
  static get instance(): SpecializationsClient {
    return this._instance || (this._instance = new this());
  }

  private getSpecializationsUrl(): string {
    return this.getBaseUrl() + '/specializations';
  }

  async getSpecializations(): Promise<SpecializationView[]> {
    return http.get<SpecializationView[]>(this.getSpecializationsUrl());
  }
}

export const specializationsClient = SpecializationsClient.instance;
