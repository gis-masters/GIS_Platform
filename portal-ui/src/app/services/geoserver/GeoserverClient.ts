import { Client } from '../api/Client';

export abstract class GeoserverClient extends Client {
  protected getGeoserverUrl(): string {
    return this.getBaseUrl() + '/geoserver';
  }
}
