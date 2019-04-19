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

  private _wfsUrl = this.serverProp.geoServerUrl;

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

  getFeatures(complexName: string): Observable<WfsFeatureCollection> {
    const url = this.prepareFeaturesLink(complexName);

    return this.http
               .get<WfsFeatureCollection>(url);
  }

  private prepareLink(typeName: string, objectId: string) {
    const workspaceName = typeName.split(':')[0];

    return this._wfsUrl + '/' + workspaceName + '/ows'
                        + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName
                        + '&outputFormat=application%2Fjson&srsName=EPSG:3857&featureID=' + objectId;
  }

  private prepareFeaturesLink(typeName: string) {
    const workspaceName = typeName.split(':')[0];

    return this._wfsUrl + '/' + workspaceName + '/ows'
                        + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName
                        + '&outputFormat=application%2Fjson&srsName=EPSG:3857';
  }

  get wfsUrl(): string {
    return this._wfsUrl;
  }

  set wfsUrl(value: string) {
    this._wfsUrl = value;
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
