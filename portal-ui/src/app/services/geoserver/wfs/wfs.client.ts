import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { Projection } from '../../data/projections/projections.models';
import { getProjectionCode } from '../../data/projections/projections.util';
import { saveAsBlob } from '../../util/FileSaver';
import { Mime } from '../../util/Mime';
import { extractFeatureTypeNameFromComplexName } from '../featureType/featureType.util';
import { GeoserverClient } from '../GeoserverClient';
import { WfsFeatureCollection } from './wfs.models';

@boundClass
class WfsClient extends GeoserverClient {
  private static _instance: WfsClient;
  static get instance(): WfsClient {
    return this._instance || (this._instance = new this());
  }

  protected getWfsUrl(): string {
    return this.getGeoserverUrl() + '/wfs';
  }

  async getFeatureCollectionByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
    return http.post<WfsFeatureCollection>(this.getWfsUrl(), xml, {
      headers: { 'Content-Type': Mime.XML },
      params: {
        exceptions: Mime.JSON,
        outputFormat: Mime.JSON
      },
      cache: { clear: false, disabled: false }
    });
  }

  async getShapeFile(layerComplexName: string, projection: Projection): Promise<void> {
    const file = await http.get<string>(this.getWfsUrl(), {
      responseType: 'blob',
      headers: { 'Content-Type': Mime.ZIP },
      params: {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeNames: layerComplexName,
        exceptions: Mime.JSON,
        outputFormat: Mime.SHAPE_ZIP,
        encoding: undefined,
        srsName: getProjectionCode(projection),
        format_options: 'CHARSET:UTF-8'
      },
      cache: { clear: false, disabled: false }
    });

    const blob = new Blob([file], { type: Mime.ZIP });
    const nameForZip = `${extractFeatureTypeNameFromComplexName(layerComplexName)}__${projection.authSrid}.zip`;

    saveAsBlob(nameForZip, blob);
  }

  async getFeatureCollection(params: Record<string, string>): Promise<WfsFeatureCollection> {
    return http.get<WfsFeatureCollection>(this.getWfsUrl(), { params, headers: { 'Content-Type': Mime.JSON } });
  }

  update(payload: string): Promise<string> {
    return http.post(this.getWfsUrl(), payload, { headers: { 'Content-Type': Mime.XML }, responseType: 'text' });
  }
}

export const wfsClient = new WfsClient();
