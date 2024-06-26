import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import WFS, { WriteTransactionOptions } from 'ol/format/WFS';
import { Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom';

import { currentUser } from '../../stores/CurrentUser.store';
import { http } from '../api/http.service';
import { getVectorTableMultipleRecordsUrl } from '../api/server-urls.service';
import { usersService } from '../auth/users/users.service';
import { getFeatureProjection } from '../data/projections/projections.service';
import { getProjectionCode } from '../data/projections/projections.util';
import { OldSchema } from '../data/schema/schemaOld.models';
import { createFeature } from '../data/vectorData/vectorData.service';
import { environment } from '../environment';
import { CrgLayer } from '../gis/layers/layers.models';
import { services } from '../services';
import { FeatureUtil } from '../util/FeatureUtil';
import { Mime } from '../util/Mime';
import { wfsGeometryToGeometry } from '../util/open-layers.util';
import { extractFeatureId } from './featureType/featureType.util';
import { CoordinateEdited, GeometryType, NewWfsFeature, WfsFeature, WfsGeometry } from './wfs/wfs.models';
import { updateFeature } from './wfs/wfs.service';

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

  async multipleEdit(
    datasetId: string,
    tableId: string,
    features: WfsFeature<Coordinate | CoordinateEdited>[],
    properties: Properties
  ): Promise<void> {
    const featureCutIds: string = features.map(feature => extractFeatureId(feature.id)).join(',');

    const url = getVectorTableMultipleRecordsUrl(datasetId, tableId, featureCutIds);

    await http.patch(url, properties);
  }

  async updateFeatures(
    layerName: string,
    features: WfsFeature<Coordinate | CoordinateEdited>[],
    schema: OldSchema,
    newProperties: Properties,
    geometry?: WfsGeometry<Coordinate>
  ): Promise<string> {
    await usersService.fetchCurrentUser();

    const workspace = `${environment.scratchWorkspaceName}_${currentUser.orgId}`;

    const featuresForUpdate: Feature<Geometry>[] = features.map(feature => {
      const calculated = FeatureUtil.calculateByFunction(
        { ...feature.properties, ...newProperties },
        schema.calcFiledFunction
      );

      const newFeature = new Feature({ ...newProperties, ...calculated });
      newFeature.setId(feature.id);

      if (geometry) {
        let geom: Geometry;
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

  async insertFeatures(
    featuresData: WfsFeature[],
    { nativeCRS, dataset, tableName }: Partial<CrgLayer>
  ): Promise<string[]> {
    await usersService.fetchCurrentUser();
    const workspace = `${environment.scratchWorkspaceName}_${currentUser.orgId}`;

    const options: WriteTransactionOptions = {
      featureNS: workspace,
      featureType: tableName,
      featurePrefix: '',
      nativeElements: [],
      gmlOptions: { srsName: nativeCRS }
    };

    const featuresToInsert: Feature<Geometry>[] = featuresData.map((featureData: WfsFeature) => {
      const feature = new Feature(featureData.properties);

      // TODO: брать поле с геометрией из схемы
      if (featureData.geometry) {
        feature.set('shape', wfsGeometryToGeometry(featureData.geometry));
      }

      return feature;
    });

    const payload = this.xs.serializeToString(this.getNode(TransactionType.INSERT, featuresToInsert, options));

    if (featuresData.length === 1) {
      const { geometry, properties } = featuresData[0];
      const newFeature: NewWfsFeature = { type: 'Feature', geometry, properties };
      const record = await createFeature(dataset, tableName, newFeature);

      return [record.id];
    }

    const responseXML = await updateFeature(payload);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseXML, Mime.XML);

    return [...xmlDoc.querySelector('InsertResults').querySelectorAll('FeatureId')].map((f: Element) =>
      f.getAttribute('fid')
    );
  }

  private getNode(type: TransactionType, features: Feature<Geometry>[], options: WriteTransactionOptions): Node {
    let node: Node;
    switch (type) {
      case TransactionType.INSERT: {
        node = this.formatWFS.writeTransaction(features, null, null, options);
        break;
      }
      case TransactionType.UPDATE: {
        node = this.formatWFS.writeTransaction(null, features, null, options);
        break;
      }
      case TransactionType.DELETE: {
        node = this.formatWFS.writeTransaction(null, null, features, options);
        break;
      }
      default: {
        services.logger.warn('Unsupported transaction type: ', type);
      }
    }

    return node;
  }
}

export const transformFeature = TransformFeatureService.instance;
