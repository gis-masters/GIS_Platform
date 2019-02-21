import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class WfsService {

  private _fwsUrl = this.serverProp.geoServerUrl;

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('WfsService start');
  }

  // http://localhost:8080/geoserver/work_workspace/ows?service=WFS&version=1.0.0&
  // request=GetFeature&
  // typeName=work_workspace%3Aelectricline&
  // maxFeatures=50&
  // outputFormat=application%2Fjson
  // &featureID=30
  getFeature(layerName: string, objectId: string): Observable<WfsFeatureCollection> {
    let url = this.prepareLink(layerName, objectId);

    return this.http
               .get<WfsFeatureCollection>(url);
  }

  private prepareLink(typeName: string, objectId: string) {
    const workspaceName = typeName.split(':')[0];

    return this._fwsUrl + '/' + workspaceName + '/ows'
                        + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName
                        + '&outputFormat=application%2Fjson&srsName=EPSG:3857&featureID=' + objectId;
  }

  get fwsUrl(): string {
    return this._fwsUrl;
  }

  set fwsUrl(value: string) {
    this._fwsUrl = value;
  }
}

export interface WfsFeatureCollection {
  type: string;
  features: WfsFeature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: any;
  bbox: any
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
