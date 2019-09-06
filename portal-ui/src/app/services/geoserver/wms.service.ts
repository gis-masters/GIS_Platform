import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class WmsService {

  private _baseUrl = this.serverProp.geoServerUrl + '/wms';
  private request = 'GetLegendGraphic';
  private version = '1.3.0';
  private format = 'image/png';
  private width = '40';
  private height = '20';
  private legendOptions = 'fontAntiAliasing:true';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('WmsService start');
  }

  // http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=topp:states
  getFullLegend(complexLayerName: string): Observable<any> {
    const params = new HttpParams()
      .set('REQUEST', this.request)
      .set('VERSION', this.version)
      .set('FORMAT', this.format)
      .set('WIDTH', this.width)
      .set('HEIGHT', this.height)
      .set('LAYER', complexLayerName);

    return this.http
               .get(this._baseUrl, {responseType: 'blob', params: params})
               .pipe(
                 catchError(this.baseService.handleError('getLegend', []))
               );
  }

  /**
   * Get a graphic that is representative of specific rule by their name.
   *
   * @param complexLayerName  Название слоя в формате 'workspace:layerName'
   * @param ruleName          Название правила в стиле. Ожидаем что стили будут основаны на атрибуте classid,
   *                          и будут содержать его значение в названии.
   */
  getLegendRule(complexLayerName: string, ruleName: string): Observable<any> {
    const params = new HttpParams()
      .set('REQUEST', this.request)
      .set('VERSION', this.version)
      .set('FORMAT', this.format)
      .set('WIDTH', this.width)
      .set('HEIGHT', this.height)
      .set('LEGEND_OPTIONS', this.legendOptions)
      .set('LAYER', complexLayerName)
      .set('RULE', ruleName);

    return this.http
               .get(this._baseUrl, {responseType: 'blob', params: params})
               .pipe(
                 catchError(this.baseService.handleError('getLegend', []))
               );
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

}
