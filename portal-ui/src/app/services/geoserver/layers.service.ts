import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {NameHrefProjection} from './projections';
import {TokenStorageService} from '../token-storage.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';
import {GeoStyle} from './styles.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  private layersUrl = this.serverProp.geoServerUrl + '/rest/layers';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private tokenStorage: TokenStorageService,
              private serverProp: ServerPropertiesService) {
    logger.info('LayersService start');
  }

  getAll(): Observable<GeoLayer | any> {
    return this.http
      .get<GeoLayer>(this.layersUrl)
      .pipe(
        catchError(this.baseService.handleError('getLayers', []))
      );
  }

  addStyle(styleName: string, fileName: string, layer: string): Observable<any> {
    const params = new HttpParams();
    params.append('default', 'true');

    const payload = {
      style: {
        name: 'functionalzone_style',
        filename: 'functionalzone_style.sld'
      }
    };

    this.logger.info('payload: ', payload);

    return this.http
               .post(this.layersUrl + '/' + layer + '/styles', payload, {params: params});
  }

}

export interface GeoLayer {
  layers: {
    layer: NameHrefProjection[]
  };
}

export interface Layer {
  name: string;
  type: string;
  defaultStyle: NameHrefProjection;
  resource: any;
  attribution: any;
}
