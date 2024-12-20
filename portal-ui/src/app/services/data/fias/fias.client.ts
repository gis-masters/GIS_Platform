import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { DataClient } from '../DataClient';
import { FiasApiItem } from './fias.models';

@boundClass
class FiasClient extends DataClient {
  private static _instance: FiasClient;
  static get instance(): FiasClient {
    return this._instance || (this._instance = new this());
  }

  private getAddressUrl(): string {
    return this.getDataUrl() + '/integration/fias/fulladdress';
  }

  private getOktmoUrl(): string {
    return this.getDataUrl() + '/integration/fias/oktmo';
  }

  async getAddressItems(address: string): Promise<FiasApiItem[]> {
    return http.get<FiasApiItem[]>(this.getAddressUrl(), {
      params: { address }
    });
  }

  async getOktmoItems(cityName: string): Promise<FiasApiItem[]> {
    return http.get<FiasApiItem[]>(this.getOktmoUrl(), {
      params: { cityName }
    });
  }
}

export const fiasClient = FiasClient.instance;
