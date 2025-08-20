import { boundClass } from 'autobind-decorator';

import { PageableResources, SpatialReferenceSystem } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { EditProjectionModel } from './projections.models';

@boundClass
class ProjectionsClient extends Client {
  private static _instance: ProjectionsClient;
  static get instance(): ProjectionsClient {
    return this._instance || (this._instance = new this());
  }

  private getProjectionUrl(): string {
    return this.getDataUrl() + '/srs';
  }

  async getKnownProjection(pageOptions: PageOptions): Promise<PageableResources<SpatialReferenceSystem>> {
    const params = preparePageOptions(pageOptions, true);

    return await http.get<PageableResources<SpatialReferenceSystem>>(this.getProjectionUrl(), { params });
  }

  async createCustomProjection(projection: EditProjectionModel): Promise<SpatialReferenceSystem> {
    return await http.post(this.getProjectionUrl(), projection);
  }

  async deleteProjection(authSrid: number): Promise<void> {
    return await http.delete(`${this.getProjectionUrl()}/${authSrid}`);
  }

  async updateProjection(authSrid: number, projection: EditProjectionModel): Promise<SpatialReferenceSystem> {
    return await http.patch(`${this.getProjectionUrl()}/${authSrid}`, projection);
  }
}

export const projectionsClient = ProjectionsClient.instance;
