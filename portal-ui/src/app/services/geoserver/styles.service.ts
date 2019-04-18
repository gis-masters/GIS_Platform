import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NameHrefProjection} from './projections';
import {TokenStorageService} from '../token-storage.service';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

  private layersUrl = this.serverProp.geoServerUrl + '/rest/styles';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private serverProp: ServerPropertiesService) {
  }

  getAll(): Observable<NameHrefProjection[] | any> {
    return this.http
               .get(this.layersUrl)
               .pipe(
                 map((response: any) => response.styles.style)
               );
  }

  /**
   * Я предпологаю что наименование стиля, которые поидее должны быть уже созданы, будет таким же как и слой + postfix: '_style'.
   * @param styleName - Название стиля
   */
  getByName(styleName: string): Observable<GeoStyle | any> {
    return this.http
               .get<GeoStyle>(this.layersUrl + '/' + styleName + '_style');
  }

}

export interface GeoStyle {
  name: string;
  filename: string;
  format: string;
  languageVersion: {
    version: string
  };
}
