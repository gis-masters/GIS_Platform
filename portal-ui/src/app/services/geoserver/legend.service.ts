import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LegendService {

  private _baseUrl: string;
  private request = 'GetLegendGraphic';
  private version = '1.3.0';
  private format = 'image/png';
  private width = '40';
  private height = '20';

  constructor(private http: HttpClient,
              private serverProp: ServerPropertiesService) {
    this.serverProp.geoServerUrl.then((geoServerUrl) => {
      this._baseUrl = geoServerUrl + '/wms';
    });
  }

  /**
   * Get a graphic that is representative of specific rule by their name.
   *
   * @param complexLayerName  Название слоя в формате 'workspace:layerName'
   * @param ruleName          Название правила в стиле. Ожидаем что в названии стиля будет использован атрибут на
   *                          основе которого сделан фильтр.
   */
  getLegendGraphicByRuleName(complexLayerName: string, ruleName: string): Observable<Blob> {
    const params = new HttpParams()
      .set('REQUEST', this.request)
      .set('VERSION', this.version)
      .set('FORMAT', this.format)
      .set('WIDTH', this.width)
      .set('HEIGHT', this.height)
      .set('LAYER', complexLayerName)
      .set('RULE', ruleName);

    return this.http.get(this._baseUrl, {responseType: 'blob', params: params});
  }

}
