import { boundClass } from 'autobind-decorator';

import { DataClient } from '../DataClient';
import { http } from '../../api/http.service';

import { Fias } from './fias.models';

@boundClass
class FiasClient extends DataClient {
  private static _instance: FiasClient;

  static get instance(): FiasClient {
    return this._instance || (this._instance = new this());
  }

  private getFiasAddressesUrl(): string {
    return this.getDataUrl() + '/integration/fias/fulladdress';
  }

  private getFiasOktmoUrl(): string {
    return this.getDataUrl() + '/integration/fias/oktmo';
  }

  async getFiasAddresses(address: string): Promise<Fias[]> {
    return http.get<Fias[]>(this.getFiasAddressesUrl(), {
      params: { address }
    });
  }

  async getFiasOktmoAddresses(cityName: string): Promise<Fias[]> {
    return http.get<Fias[]>(this.getFiasOktmoUrl(), {
      params: { cityName }
    });
  }
}

export const fiasClient = FiasClient.instance;
