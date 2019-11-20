import {Injectable} from '@angular/core';
import {Observable, defer} from 'rxjs';

import {CrgModels} from '../crg/models';
import {ServerPropertiesService} from '../server-properties.service';
import {Util} from './util';
import {UsedGeometryType} from '../open-layer/GeometryType';
import {HttpQueue} from '../util/HttpQueue';

@Injectable({
  providedIn: 'root'
})
export class WfsService {

  constructor(private httpq: HttpQueue,
              private serverProp: ServerPropertiesService) {
  }

  async getFeatureById(complexName: string, objectId: string): Promise<WfsFeature> {
    const url = await this.prepareLink(complexName, objectId);
    const featureCollection: WfsFeatureCollection = await this.httpq.get<WfsFeatureCollection>(url);

    if (featureCollection && featureCollection.features.length > 0) {
      return featureCollection.features[0];
    } else {
      throw new Error('Not found feature by ID: ' + objectId);
    }
  }

  getFeatures(complexName: string, requestModel?: CrgModels): Observable<WfsFeatureCollection> {
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

    return defer(async () => {
      const url = (await this.serverProp.geoServerUrl) + '/wfs';
      const fCollection: WfsFeatureCollection =
        await this.httpq.get<WfsFeatureCollection>(url, {params: params})

      return this.clearFeatureId(fCollection);
    });
  }

  /**
   * Выборка обьектов слоя по XML фильтру.
   * @param xml Подготовленный, при помощи библиотеки openLayers, XML document конвертированный в строку.
   */
  async getFeaturesByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
    const url = (await this.serverProp.geoServerUrl) + '/wfs';

    return this.httpq
      .post<WfsFeatureCollection>(url, xml, {params: {exceptions: 'application/json'}});
  }

  private async prepareLink(typeName: string, objectId: string): Promise<string> {
    const workspaceName = typeName.split(':')[0];

    return (await this.serverProp.geoServerUrl) + '/' + workspaceName + '/ows'
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
