import {Observable} from 'rxjs';
import {RequestModel} from '../models/requestModel';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {error} from '@angular/compiler/src/util';
import {ServerPropertiesService} from '../server-properties.service';
import {Util} from './util';
import {UsedGeometryType} from "../open-layer/open-layers.service";

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

  getFeatures(complexName: string, requestModel?: RequestModel): Observable<WfsFeatureCollection> {
    const url = this.serverProp.geoServerUrl + '/wfs';

    const params = {
      service: 'wfs',
      // version: '2.0.0',
      request: 'GetFeature',
      srsName: 'EPSG:3857',
      outputFormat: 'application/json',
      exceptions: 'application/json',
      typeName: complexName,
      // PROPERTYNAME: this.fillProp(complexName),
      sortBy: Util.generateSortParam(requestModel)
    };

    if (complexName === 'yalta_1:transpsanitarygapzone') {

    }

    if (requestModel && requestModel.page) {
      const countRows = (requestModel.page.pageSize) ? requestModel.page.pageSize.toString() : '100';
      const offset = (requestModel.page.offset) ? requestModel.page.offset.toString() : '0';

      params['startindex'] = Number(offset) * Number(countRows);
      params['count'] = countRows;
    }

    const cqlFilter = Util.generateFilter(requestModel);
    if (!!cqlFilter) {
      params['CQL_FILTER'] = cqlFilter;
    }

    return this.http
               .get<WfsFeatureCollection>(url, {params: params})
               .pipe(
                 map((fCollection: WfsFeatureCollection) => this.clearFeatureId(fCollection))
               );
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

  // As example for PRODUCT BACKLOG ITEM: 121
  private fillProp(complexName: string) {
    if (complexName === 'yalta_1:functionalzone') {
      return 'classid,fz_mfstp,fz_odstp,fz_ingstp,fz_trstp,fz_shstp,fz_recstp,fz_orecstp,area,info_obj,' +
        'constr_den,bld_height,pop_den,population,hzrd_class,other,event_time,status,reg_status,globalid,shape,' +
        'shape_leng,shape_area';
    } else if (complexName === 'yalta_1:transpsanitarygapzone') {
      return 'classid,zone_desc,objectname,source,note,status,globalid';
    } else {
      return '';
    }
  }

  private prepareLink(typeName: string, objectId: string) {
    const workspaceName = typeName.split(':')[0];

    return this.serverProp.geoServerUrl + '/' + workspaceName + '/ows'
                        + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName
                        + '&outputFormat=application%2Fjson&srsName=EPSG:3857&featureID=' + objectId;
  }

  private clearFeatureId(fCollection: WfsFeatureCollection): WfsFeatureCollection {
    fCollection.features.forEach((feature: WfsFeature) => {
      const splitElement = feature.id.split('.')[1];
      if (splitElement) {
        feature.id = splitElement;
      }
    });

    return fCollection;
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
  bbox: any;
}

export interface WfsFeature {
  type: string;
  id: string;
  geometry: WfsGeometry;
  geometry_name: string;
  properties: any;
}

export interface WfsGeometry {
  type: UsedGeometryType;
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
