import { Feature } from 'ol';
import WFS, { WriteTransactionOptions } from 'ol/format/WFS';
import { Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom';

import { currentUser } from '../../../stores/CurrentUser.store';
import { http } from '../../api/http.service';
import { getVectorTableMultipleRecordsUrl } from '../../api/server-urls.service';
import { usersService } from '../../auth/users/users.service';
import { getFeatureProjection } from '../../data/projections/projections.service';
import { getProjectionCode } from '../../data/projections/projections.util';
import { OldSchema } from '../../data/schema/schemaOld.models';
import { environment } from '../../environment';
import { services } from '../../services';
import { FeatureUtil } from '../../util/FeatureUtil';
import { extractFeatureId } from '../featureType/featureType.util';
import { GeometryType, WfsFeature, WfsGeometry } from './wfs.models';
import { updateFeature } from './wfs.service';

export enum TransactionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete'
}

interface Properties {
  [key: string]: unknown;
}

// TODO: пофиксить ошибки типизации
export class TransformFeatureService {
  private static _instance: TransformFeatureService;
  static get instance(): TransformFeatureService {
    return this._instance || (this._instance = new this());
  }

  private xs = new XMLSerializer();
  private formatWFS = new WFS();

  // TODO: Это сохранение через data-service - оно не должно быть рядом с geoserver
  async multipleEdit(
    datasetId: string,
    tableId: string,
    features: WfsFeature[],
    properties: Properties
  ): Promise<void> {
    const featureCutIds: string = features.map(feature => extractFeatureId(feature.id)).join(',');

    const url = getVectorTableMultipleRecordsUrl(datasetId, tableId, featureCutIds);

    await http.patch(url, properties);
  }

  // TODO: Это сохранение через geoserver - оно не должно быть рядом с data-service
  async updateFeatures(
    layerName: string,
    features: WfsFeature[],
    schema: OldSchema,
    newProperties: Properties,
    geometry?: WfsGeometry
  ): Promise<string> {
    await usersService.fetchCurrentUser();

    const workspace = `${environment.scratchWorkspaceName}_${currentUser.orgId}`;

    const featuresForUpdate: Feature<Geometry>[] = features.map(feature => {
      const calculated = schema.calcFiledFunction
        ? FeatureUtil.calculateByFunction({ ...feature.properties, ...newProperties }, schema.calcFiledFunction)
        : {};

      const newFeature = new Feature({ ...newProperties, ...calculated });
      newFeature.setId(feature.id);

      let geom: Geometry | undefined;

      if (geometry) {
        if (geometry.type === GeometryType.POINT) {
          geom = new Point(geometry.coordinates);
        }
        if (geometry.type === GeometryType.MULTI_POINT) {
          geom = new MultiPoint(geometry.coordinates);
        }
        if (geometry.type === GeometryType.LINE_STRING) {
          geom = new LineString(geometry.coordinates);
        }
        if (geometry.type === GeometryType.MULTI_LINE_STRING) {
          geom = new MultiLineString(geometry.coordinates);
        }
        if (geometry.type === GeometryType.POLYGON) {
          geom = new Polygon(geometry.coordinates);
        }
        if (geometry.type === GeometryType.MULTI_POLYGON) {
          geom = new MultiPolygon(geometry.coordinates);
        }

        newFeature.setGeometry(geom);
      }

      return newFeature;
    });

    const projection = await getFeatureProjection(features[0]);
    const crs = projection ? getProjectionCode(projection) : undefined;

    const options: WriteTransactionOptions = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspace,
      nativeElements: [],
      gmlOptions: {
        srsName: crs
      }
    };

    const payload = this.xs
      .serializeToString(this.getNode(TransactionType.UPDATE, featuresForUpdate, options))
      .replaceAll(new RegExp(`xmlns:${workspace}="castyl_for_remove"`, 'g'), '')
      .replaceAll('<Name>geometry</Name>', '<Name>shape</Name>');

    return updateFeature(payload);
  }

  private getNode(type: TransactionType, features: Feature<Geometry>[], options: WriteTransactionOptions): Node {
    let node: Node | undefined;
    switch (type) {
      case TransactionType.INSERT: {
        node = this.formatWFS.writeTransaction(features, [], [], options);
        break;
      }
      case TransactionType.UPDATE: {
        node = this.formatWFS.writeTransaction([], features, [], options);
        break;
      }
      case TransactionType.DELETE: {
        node = this.formatWFS.writeTransaction([], [], features, options);
        break;
      }
      default: {
        services.logger.warn('Unsupported transaction type: ', type);
      }
    }

    if (!node) {
      throw new Error('Не удалось создать xml-node');
    }

    return node;
  }
}

export const transformFeatureService = TransformFeatureService.instance;
