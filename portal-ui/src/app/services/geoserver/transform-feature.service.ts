import { Feature } from 'ol';
import WFS, { WriteTransactionOptions } from 'ol/format/WFS';
import { Geometry, MultiLineString, MultiPolygon, Point } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import { MapperUtil } from '../open-layer/MapperUtil';
import { WfsFeature, WfsGeometry } from './wfs-models';
import { serverProperties } from '../server-properties.service';
import { FeatureDescription } from '../crg/schema.service';
import { FeatureUtil } from '../util/FeatureUtil';
import { getFeatureProjection } from './projections.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { services } from '../services';
import { Coordinate } from 'ol/coordinate';

export enum TransactionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete'
}

interface Properties {
  [key: string]: any;
}

export class TransformFeatureService {

  private static _instance: TransformFeatureService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private wfsUrl: string;
  private xs = new XMLSerializer();
  private formatWFS = new WFS();

  constructor() {
    serverProperties.geoServerUrl.then((geoServerUrl) => {
      this.wfsUrl = geoServerUrl + '/wfs';
    });
  }

  updateProperty(tableName: string, featureId: string, propName: string, propValue: string): Promise<string> {
    const projectName = currentProject.internalName;

    const payload =
      `<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
        <Update typeName="${projectName}:${tableName}">
          <Property>
              <Name>${propName}</Name>
              <Value>${propValue}</Value>
          </Property>
          <Filter xmlns="http://www.opengis.net/ogc">
              <FeatureId fid="${featureId}"/>
          </Filter>
        </Update>
      </Transaction>`;

    return services.httpq
                   .post(this.wfsUrl, payload, { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' });
  }

  updateFeatures(features: WfsFeature[],
                 schema: FeatureDescription,
                 newProperties: Properties,
                 geometry?: WfsGeometry<Coordinate>): Promise<string> {
    const workspaceName = currentProject.internalName;

    const featuresForUpdate: Feature[] = features.map(feature => {
      const calculated = FeatureUtil
        .calculateByFunction({ ...feature.properties, ...newProperties }, schema.calcFiledFunction);

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
      featurePrefix: workspaceName,
      nativeElements: [],
      gmlOptions: {
        srsName: getFeatureProjection(features[0]).id
      }
    };

    const payload = this.xs.serializeToString(this.getNode(TransactionType.UPDATE, featuresForUpdate, options))
      .replace(new RegExp(`xmlns:${ workspaceName }="castyl_for_remove"`, 'g'), '')
      .replace(/<Name>geometry<\/Name>/g, '<Name>shape</Name>');

    return services.httpq.post(this.wfsUrl, payload, { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' });
  }

  insertFeatures(featuresData: WfsFeature[], layerName: string, srsName: string) {
    const workspaceName = currentProject.internalName;

    const options: WriteTransactionOptions = {
      featureNS: workspaceName,
      featureType: layerName,
      featurePrefix: '',
      nativeElements: [],
      gmlOptions: { srsName }
    };

    const featuresToInsert: Feature[] = featuresData.map((featureData: WfsFeature) => {
      const feature = new Feature(featureData.properties);

      // TODO: брать поле с геометрией из схемы
      if (featureData.geometry) {
        feature.set('shape', MapperUtil.mapFwsGeometryToGeometry(featureData.geometry as WfsGeometry<Coordinate>));
      }

      return feature;
    });

    const payload = this.xs.serializeToString(this.getNode(TransactionType.INSERT, featuresToInsert, options));

    return services.httpq.post(this.wfsUrl, payload, { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' });
  }

  deleteFeatures(featureIds: string[], layerName: string) {
    const workspaceName = currentProject.internalName;
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresToDelete = featureIds.map(id => {
      const newFeature = new Feature();
      newFeature.setId(id);

      return newFeature;
    });

    const payload = this.xs.serializeToString(this.getNode(TransactionType.DELETE, featuresToDelete, options))
      .replace(new RegExp(`xmlns:${ workspaceName }="castyl_for_remove"`, 'g'), '');

    return services.httpq.post(
      this.wfsUrl,
      payload,
      { headers: { 'Content-Type': 'text/xml' }, responseType: 'text' }
    );
  }

  private getNode(type: TransactionType, features: Feature[], options: WriteTransactionOptions): Node {
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
