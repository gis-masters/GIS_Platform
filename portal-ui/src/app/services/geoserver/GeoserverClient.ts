import { Client } from '../api/Client';

export abstract class GeoserverClient extends Client {
  protected getGeoserverUrl(): string {
    return this.getBaseUrl() + '/geoserver';
  }

  protected getGeoserverWorkspaceUrl(workspace: string): string {
    return `${this.getGeoserverUrl()}/rest/workspaces/${workspace}`;
  }
}
