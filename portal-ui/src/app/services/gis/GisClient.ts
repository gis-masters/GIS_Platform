import { Client } from '../api/Client';

export abstract class GisClient extends Client {
  protected getProjectLayersUrl(projectId: number): string {
    return this.getProjectUrl(projectId) + '/layers';
  }
}
