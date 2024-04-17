import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { Client } from '../../api/Client';
import { Specialization } from '../../../../server-types/common-contracts';

@boundClass
class SpecializationsClient extends Client {
  private static _instance: SpecializationsClient;

  static get instance(): SpecializationsClient {
    return this._instance || (this._instance = new this());
  }

  private getSpecializationsUrl(): string {
    return this.getBaseUrl() + '/specializations';
  }

  async getSpecializations(): Promise<Specialization[]> {
    return http.get<Specialization[]>(this.getSpecializationsUrl());
  }
}

export const specializationsClient = SpecializationsClient.instance;
