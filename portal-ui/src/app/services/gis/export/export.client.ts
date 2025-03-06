import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';

@boundClass
class ExportClient extends Client {
  private static _instance: ExportClient;
  static get instance(): ExportClient {
    return this._instance || (this._instance = new this());
  }

  protected getExportShapeUrl(): string {
    return this.getBaseUrl() + '/gis/export/shape';
  }

  async getExportShape(typeName: string, srsName: string, layerTitle: string): Promise<string> {
    return http.get(this.getExportShapeUrl(), {
      responseType: 'blob',
      headers: { 'Content-Type': Mime.ZIP },
      params: {
        typeName,
        srsName,
        layerTitle
      },
      cache: { clear: false, disabled: false }
    });
  }
}

export const exportClient = ExportClient.instance;
