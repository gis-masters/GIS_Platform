import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { GeoserverClient } from '../GeoserverClient';
import { FilteredStylesLayerRequest, FilteredStylesResponse, StyleGeoserverInfo } from './styles.models';

@boundClass
class StylesClient extends GeoserverClient {
  private static _instance: StylesClient;
  static get instance(): StylesClient {
    return this._instance || (this._instance = new this());
  }

  protected getActualLegendUrl(): string {
    return this.getDataUrl() + '/styles/actual';
  }

  protected getStylesUrl(): string {
    return this.getGeoserverUrl() + '/rest/styles';
  }

  getStyleSld(complexStyleName: string): Promise<string> {
    const names = complexStyleName.split(':');
    names.reverse();
    const [styleName, workspaceName] = names;
    const url = workspaceName
      ? `${this.getGeoserverWorkspaceUrl(workspaceName)}/styles/${styleName}.sld`
      : `${this.getStylesUrl()}/${styleName}.sld`;

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

  async getStylesList() {
    return await http.get<{ styles: { style: StyleGeoserverInfo[] } }>(this.getStylesUrl());
  }
}

export const stylesClient = StylesClient.instance;
