import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {filter, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {error} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class WfsService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('WfsService start');
  }

  getFeatureById(complexName: string, objectId: string): Observable<WfsFeature> {
    const url = this.prepareLink(complexName, objectId);

    return this.http
               .get<WfsFeatureCollection>(url)
               .pipe(
                 filter((featureCollection: WfsFeatureCollection) => !!featureCollection),
                 map((featureCollection: WfsFeatureCollection) => {
                   if (featureCollection.features.length > 0) {
                     return featureCollection.features[0];
                   } else {
                     return error('Not found feature by ID: ' + objectId);
                   }
                 })
               );
  }

  getFeatures(complexName: string, startindex?: number, count?: number): Observable<WfsFeatureCollection> {
    const url = this.serverProp.geoServerUrl + '/wfs';

    const params = {
      service: 'wfs',
      version: '2.0.0',
      request: 'GetFeature',
      srsName: 'EPSG:3857',
      outputFormat: 'application/json',
      exceptions: 'application/json',
      typeName: complexName,
      startindex: startindex ? startindex.toString() : '0',
      count: count ? count.toString() : '10'
    };

    return this.http
               .get<WfsFeatureCollection>(url, {params: params});
  }

  /**
   * Выборка обьектов слоя по XML фильтру.
   * @param xml Подготовленный, при помощи библиотеки openLayers, XML document конвертированный в строку.
   */
  getFeaturesByXmlFilter(xml: string): Observable<WfsFeatureCollection> {
    const url = this.serverProp.geoServerUrl + '/wfs';

    return this.http
               .post<WfsFeatureCollection>(url, xml, {params: {exceptions: 'application/json'}});
  }

  private prepareLink(typeName: string, objectId: string) {
    const workspaceName = typeName.split(':')[0];

    return this.serverProp.geoServerUrl + '/' + workspaceName + '/ows'
                        + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName
                        + '&outputFormat=application%2Fjson&srsName=EPSG:3857&featureID=' + objectId;
  }

}

import {ServerPropertiesService} from '../server-properties.service';

export interface WfsFeatureCollection {
  type: string;
  features: WfsFeature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: any;
  bbox: any;
}

export interface WfsFeature {
  type: string;
  id: string;
  geometry: WfsGeometry;
  geometry_name: string;
  properties: any;
}

interface WfsGeometry {
  type: string;
  coordinates: any;
}

// TODO: Перенести позже в более общее место (пока применяю только для WFS поэтому тут)
export interface GeoserverJSONException {
  version: string;
  exceptions: ExceptionItem[];
}

export interface ExceptionItem {
  code: string;
  locator: string;
  text: string;
}
