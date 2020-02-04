import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature } from 'ol';
import WFS, { WriteTransactionOptions } from 'ol/format/WFS';
import { Geometry, Point, MultiLineString, MultiPolygon } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import { NGXLogger } from 'ngx-logger';

import { MapperUtil } from '../open-layer/MapperUtil';
import { WfsFeature, WfsGeometry } from './wfs-models';
import { serverProperties } from '../server-properties.service';

export enum TransactionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

type Properties = { [key: string]: any };

@Injectable({
  providedIn: 'root'
})
export class TransformFeatureService {

  private wfsUrl: string;
  private xs = new XMLSerializer();
  private formatWFS = new WFS();

  constructor(private logger: NGXLogger,
              private http: HttpClient) {
    serverProperties.geoServerUrl.then((geoServerUrl) => {
      this.wfsUrl = geoServerUrl + '/wfs';
    });
  }

  updateFeature(featureId: string, workspaceName: string, layerName: string, newProperties: Properties) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featureClone = new Feature(newProperties);
    featureClone.setId(featureId);

    const node = this.getNode(TransactionType.UPDATE, [featureClone], options);
    const payload = this.xs.serializeToString(node)
                           .replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  updateFeatures(featuresId: string[], workspaceName: string, layerName: string, newProperties: Properties, geometry?: WfsGeometry) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: [],
      gmlOptions: {srsName: 'EPSG:3857'}
    } as WriteTransactionOptions;

    const featuresForUpdate: Feature[] = featuresId.map(featureId => {
      const feature = new Feature(newProperties);
      feature.setId(featureId);

      if (geometry) {
        let geom: Geometry;
        if (geometry.type === GeometryType.POINT) {
          geom = new Point(geometry.coordinates);
        }
        if (geometry.type === GeometryType.MULTI_LINE_STRING) {
          geom = new MultiLineString(geometry.coordinates);
        }
        if (geometry.type === GeometryType.MULTI_POLYGON) {
          geom = new MultiPolygon(geometry.coordinates);
        }

        feature.setGeometry(geom);
      }

      return feature;
    });

    let payload = this.xs.serializeToString(this.getNode(TransactionType.UPDATE, featuresForUpdate, options));

    Object.keys(featuresId).forEach(featureId => {
      payload = payload.replace('xmlns:' + workspaceName + '="castyl_for_remove"', '')
                       .replace('<Name>geometry</Name>', '<Name>shape</Name>');
    });

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  insertFeatures(featuresData: WfsFeature[], workspaceName: string, layerName: string) {
    const options: WriteTransactionOptions = {
      featureNS: workspaceName,
      featureType: layerName,
      featurePrefix: '',
      nativeElements: [],
      gmlOptions: { srsName: 'EPSG:3857' }
    };

    const featuresToInsert: Feature[] = featuresData.map((featureData: WfsFeature) => {
      const feature = new Feature(featureData.properties);

      // TODO: брать поле с геометрией из схемы
      feature.set('shape', MapperUtil.mapFwsGeometryToGeometry(featureData.geometry));

      return feature;
    });

    const payload = this.xs.serializeToString(this.getNode(TransactionType.INSERT, featuresToInsert, options));

    return this.http.post(this.wfsUrl, payload, { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' });
  }

  deleteFeatures(features: WfsFeature[], workspaceName: string, layerName: string) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresToDelete: Feature[] = [];
    features.forEach(feature => {
      const newFeatures = new Feature();
      newFeatures.setId(feature.id);

      featuresToDelete.push(newFeatures);
    });

    let payload = this.xs.serializeToString(this.getNode(TransactionType.DELETE, featuresToDelete, options));

    featuresToDelete.forEach(() => {
      payload = payload.replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');
    });

    return this.http.post(
        this.wfsUrl,
        payload,
        { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' }
    );
  }

  private getNode(type: TransactionType, features: Feature[], options: WriteTransactionOptions): Node {
    let node;
    switch (type) {
      case TransactionType.INSERT:
        node = this.formatWFS.writeTransaction(features, null, null, options); break;
      case TransactionType.UPDATE:
        node = this.formatWFS.writeTransaction(null, features, null, options); break;
      case TransactionType.DELETE:
        node = this.formatWFS.writeTransaction(null, null, features, options); break;
      default:
        this.logger.warn('Unsupported transaction type: ', type);
    }

    return node;
  }
}
