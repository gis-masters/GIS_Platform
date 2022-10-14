import { Feature } from 'ol';
import WFS, { WriteTransactionOptions } from 'ol/format/WFS';
import { Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

import { CoordinateEdited, GeometryType, WfsFeature, WfsGeometry } from './wfs.models';
import { wfsGeometryToGeometry } from '../util/open-layers.util';
import { OldSchema } from '../data/schemaOld.models';
import { getFeatureProjection } from './projections.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { createVectorTableRecord } from '../data/data.service';
import { usersService } from '../data/users.service';
import { getDatasetTableMultipleRecordsUrl, getWfsUrl } from '../server-urls.service';
import { CrgLayer } from '../gis/projects.models';
import { FeatureUtil } from '../util/FeatureUtil';
import { getEnvironment } from '../environment';
import { services } from '../services';
import { http } from '../http.service';
import { Mime } from '../util/Mime';

export enum TransactionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete'
}

interface Properties {
  [key: string]: unknown;
}

export class TransformFeatureService {
  private static _instance: TransformFeatureService;

  static get instance(): TransformFeatureService {
    return this._instance || (this._instance = new this());
  }

  private xs = new XMLSerializer();
  private formatWFS = new WFS();

  async updateProperty(tableName: string, featureId: string, propName: string, propValue: string): Promise<string> {
    await usersService.fetchCurrentUser();

    const { scratchWorkspaceName } = await getEnvironment();
    const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;

    const payload = `<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
        <Update typeName="${workspace}:${tableName}">
          <Property>
              <Name>${propName}</Name>
              <Value>${propValue}</Value>
          </Property>
          <Filter xmlns="http://www.opengis.net/ogc">
              <FeatureId fid="${featureId}"/>
          </Filter>
        </Update>
      </Transaction>`;

    return http.post(await getWfsUrl(), payload, { headers: { 'Content-Type': Mime.XML }, responseType: 'text' });
  }

  async multipleEdit(datasetId: string, tableId: string, recordsId: string, properties: Properties): Promise<void> {
    const url = await getDatasetTableMultipleRecordsUrl(datasetId, tableId, recordsId);

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

    const { scratchWorkspaceName } = await getEnvironment();
    const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;

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

    const options: WriteTransactionOptions = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspace,
      nativeElements: [],
      gmlOptions: {
        srsName: getFeatureProjection(features[0]).id
      }
    };

    const payload = this.xs
      .serializeToString(this.getNode(TransactionType.UPDATE, featuresForUpdate, options))
      .replace(new RegExp(`xmlns:${workspace}="castyl_for_remove"`, 'g'), '')
      .replace(/<Name>geometry<\/Name>/g, '<Name>shape</Name>');

    return http.post(await getWfsUrl(), payload, { headers: { 'Content-Type': Mime.XML }, responseType: 'text' });
  }

  async insertFeatures(
    featuresData: WfsFeature[],
    { nativeCRS, dataset, tableName }: Partial<CrgLayer>
  ): Promise<string[]> {
    await usersService.fetchCurrentUser();
    const { scratchWorkspaceName } = await getEnvironment();
    const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;

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
      const newFeature = { ...featuresData[0], id: undefined, geometry_name: undefined };
      const record = await createVectorTableRecord(dataset, tableName, newFeature);

      return [record.id];
    }

    const responseXML = await http.post<string>(await getWfsUrl(), payload, {
      headers: { 'Content-Type': Mime.XML },
      responseType: 'text'
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseXML, Mime.XML);

    return [...xmlDoc.querySelector('InsertResults').querySelectorAll('FeatureId')].map((f: Element) =>
      f.getAttribute('fid')
    );
  }

  async deleteFeatures(featureIds: string[], layerName: string): Promise<unknown> {
    await usersService.fetchCurrentUser();

    const { scratchWorkspaceName } = await getEnvironment();
    const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;

    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspace,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresToDelete = featureIds.map(id => {
      const newFeature = new Feature();
      newFeature.setId(id);

      return newFeature;
    });

    const payload = this.xs
      .serializeToString(this.getNode(TransactionType.DELETE, featuresToDelete, options))
      .replace(new RegExp(`xmlns:${workspace}="castyl_for_remove"`, 'g'), '');

    return http.post(await getWfsUrl(), payload, { headers: { 'Content-Type': Mime.XML }, responseType: 'text' });
  }

  private getNode(type: TransactionType, features: Feature<Geometry>[], options: WriteTransactionOptions): Node {
    let node: Node;
    switch (type) {
      case TransactionType.INSERT:
        node = this.formatWFS.writeTransaction(features, null, null, options);
        break;
      case TransactionType.UPDATE:
        node = this.formatWFS.writeTransaction(null, features, null, options);
        break;
      case TransactionType.DELETE:
        node = this.formatWFS.writeTransaction(null, null, features, options);
        break;
      default:
        services.logger.warn('Unsupported transaction type: ', type);
    }

    return node;
  }
}

export const transformFeature = TransformFeatureService.instance;
