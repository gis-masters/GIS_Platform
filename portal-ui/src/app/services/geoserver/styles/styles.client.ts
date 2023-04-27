import { boundClass } from 'autobind-decorator';

import { GeoserverClient } from '../GeoserverClient';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';

import { FilteredStylesLayerRequest, FilteredStylesResponse } from './styles.models';

@boundClass
class StylesClient extends GeoserverClient {
  private static _instance: StylesClient;

  static get instance(): StylesClient {
    return this._instance || (this._instance = new this());
  }

  protected getWorkspacesUrl(): string {
    return this.getGeoserverUrl() + '/rest/workspaces/';
  }

  protected getActualLegendUrl(): string {
    return this.getDataUrl() + '/styles/actual';
  }

  getStyleSld(complexStyleName: string): Promise<string> {
    const names = complexStyleName.split(':');
    names.reverse();
    const [styleName, workspaceName] = names;
    const url = workspaceName
      ? `${this.getWorkspacesUrl()}${workspaceName}/styles/${styleName}.sld`
      : `${this.getGeoserverUrl()}/rest/styles/${styleName}.sld`;

    return http.get<string>(url, {
      headers: { 'Content-Type': Mime.SLD },
      responseType: 'text',
      cache: { disabled: true } // кешируется на уровне сервиса
    });
  }

  getLegendForMapView(requestData: FilteredStylesLayerRequest[]): Promise<FilteredStylesResponse[]> {
    return http.post<FilteredStylesResponse[]>(this.getActualLegendUrl(), requestData, {
      cache: { disabled: false, clear: false }
    });
  }
}

export const stylesClient = StylesClient.instance;
