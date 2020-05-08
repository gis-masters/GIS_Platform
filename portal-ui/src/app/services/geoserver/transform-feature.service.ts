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
import { FeatureDescription } from '../crg/data-schema.service';
import { HttpQueue } from '../util/HttpQueue';
import { FeatureUtil } from '../util/FeatureUtil';

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
              private http: HttpClient,
              private httpq: HttpQueue) {
    serverProperties.geoServerUrl.then((geoServerUrl) => {
      this.wfsUrl = geoServerUrl + '/wfs';
    });
  }

  updateFeatures(
          features: WfsFeature[],
          workspace: string,
          schema: FeatureDescription,
          newProperties: Properties,
          geometry?: WfsGeometry
  ): Promise<string> {
    const featuresForUpdate: Feature[] = features.map(feature => {
      const calculated = FeatureUtil.calculateByFunction(
                                        { ...feature.properties, ...newProperties },
                                        schema.calcFiledFunction);

      const newFeature = new Feature({ ...newProperties, ...calculated });
      newFeature.setId(feature.id);

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

        newFeature.setGeometry(geom);
      }

      return newFeature;
    });

    const options: WriteTransactionOptions = {
      featureNS: 'castyl_for_remove',
      featureType: schema.tableName,
      featurePrefix: workspace,
      nativeElements: [],
      gmlOptions: { srsName: 'EPSG:3857' }
    };

    let payload = this.xs.serializeToString(this.getNode(TransactionType.UPDATE, featuresForUpdate, options))
                          .replace(new RegExp(`xmlns:${workspace}="castyl_for_remove"`, 'g'), '')
                          .replace(/<Name>geometry<\/Name>/g, '<Name>shape</Name>');

    return this.httpq.post(this.wfsUrl, payload, { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' });
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

  deleteFeatures(featureIds: string[], workspace: string, layerName: string) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspace,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresToDelete = featureIds.map((id) => {
      const newFeature = new Feature();
      newFeature.setId(id);

      return newFeature;
    });

    let payload = this.xs.serializeToString(this.getNode(TransactionType.DELETE, featuresToDelete, options))
                                        .replace(new RegExp(`xmlns:${workspace}="castyl_for_remove"`, 'g'), '');

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
