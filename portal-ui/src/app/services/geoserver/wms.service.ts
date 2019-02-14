import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class WmsService {

  private _baseUrl = this.serverProp.geoServerUrl + '/wms';
  private default_request = 'GetLegendGraphic';
  private default_version = '1.0.0';
  private default_format = 'image/png';
  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('WmsService start');
  }

  // http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=topp:states
  getLinkForLegend(layerName: string): string {
    return this._baseUrl + '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + layerName;
  }

  getLegend(complexLayerName: string): Observable<any> {
    // this.logger.info('Try get legend for: ', complexLayerName);

    return this.http
               .get(this.getLinkForLegend(complexLayerName), {responseType: 'blob'})
               .pipe(
                 catchError(this.baseService.handleError('getLegend', []))
               );
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

}
