import { boundClass } from 'autobind-decorator';

import { PageOptions } from '../../models';
import { preparePageOptions } from '../../api/http.utils';
import { http } from '../../api/http.service';
import { Client } from '../../api/Client';
import { EpsgModel, PageableResources } from '../../../../server-types/common-contracts';

@boundClass
class EpsgClient extends Client {
  private static _instance: EpsgClient;

  static get instance(): EpsgClient {
    return this._instance || (this._instance = new this());
  }

  private getEpsgUrl(): string {
    return this.getDataUrl() + '/epsg';
  }

  async getKnownEpsg(pageOptions: PageOptions): Promise<PageableResources<EpsgModel>> {
    const params = preparePageOptions(pageOptions, true);

    return await http.get<PageableResources<EpsgModel>>(this.getEpsgUrl(), { params });
  }
}

export const epsgClient = EpsgClient.instance;
