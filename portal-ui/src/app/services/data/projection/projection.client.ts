import { boundClass } from 'autobind-decorator';

import { PageableResources, SpatialReferenceSystem } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { CreateProjectionModel } from './projection.models';

@boundClass
class ProjectionClient extends Client {
  private static _instance: ProjectionClient;

  static get instance(): ProjectionClient {
    return this._instance || (this._instance = new this());
  }

  private getProjectionUrl(): string {
    return this.getDataUrl() + '/srs';
  }

  async getKnownProjection(pageOptions: PageOptions): Promise<PageableResources<SpatialReferenceSystem>> {
    const params = preparePageOptions(pageOptions, true);

    return await http.get<PageableResources<SpatialReferenceSystem>>(this.getProjectionUrl(), { params });
  }

  async createCustomProjection(projection: CreateProjectionModel): Promise<SpatialReferenceSystem> {
    return await http.post(this.getProjectionUrl(), projection);
  }
}

export const projectionClient = ProjectionClient.instance;
