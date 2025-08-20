import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { Mime } from '../../util/Mime';

const headers = { 'Content-Type': Mime.JSON };

@boundClass
class GeometryValidationClient extends Client {
  private static _instance: GeometryValidationClient;
  static get instance(): GeometryValidationClient {
    return this._instance || (this._instance = new this());
  }

  private getMakeGeometryValidUrl(): string {
    return this.getDataUrl() + '/makeGeometryValid';
  }

  async makeGeometryValid(payload: NewWfsFeature): Promise<WfsFeature> {
    return http.post<WfsFeature>(this.getMakeGeometryValidUrl(), JSON.stringify(payload), { headers });
  }
}

export const geometryValidationClient = GeometryValidationClient.instance;
