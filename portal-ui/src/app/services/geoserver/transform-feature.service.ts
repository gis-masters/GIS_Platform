import {Feature} from 'ol';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {WfsFeature} from './wfs.service';
import {HttpClient} from '@angular/common/http';
import {MapperUtil} from '../open-layer/MapperUtil';
import WFS, {WriteTransactionOptions} from 'ol/format/WFS';
import {ServerPropertiesService} from '../server-properties.service';

export enum TransactionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Injectable({
  providedIn: 'root'
})
export class TransformFeatureService {

  private wfsUrl: string;
  private xs = new XMLSerializer();
  private formatWFS = new WFS();

  constructor(private logger: NGXLogger,
              private http: HttpClient,
              private propertiesService: ServerPropertiesService) {
    this.propertiesService.geoServerUrl.then((geoServerUrl) => {
      this.wfsUrl = geoServerUrl + '/wfs'
    });
  }

  updateFeature(featureId: string, workspaceName: string, layerName: string, newProperties: any) {
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

  updateFeatures(featuresId: string[], workspaceName: string, layerName: string, newProperties: any) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresForUpdate = [];
    featuresId.forEach(featureId => {
      const features = new Feature(newProperties);
      features.setId(featureId);

      featuresForUpdate.push(features);
    });

    let payload = this.xs.serializeToString(this.getNode(TransactionType.UPDATE, featuresForUpdate, options));

    Object.keys(featuresId).forEach(featureId => {
      payload = payload.replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');
    });

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  insertFeatures(features: WfsFeature[], workspaceName: string, layerName: string) {
    const options = {
      featureNS: workspaceName,
      featureType: layerName,
      nativeElements: [],
      gmlOptions: {srsName: 'EPSG:3857'}
    } as WriteTransactionOptions;

    const featuresToInsert = [];
    features.forEach((feature: WfsFeature) => {
      const olFeature = new Feature(feature.properties);

      olFeature.set('shape', MapperUtil.mapFwsGeometryToGeometry(feature.geometry));

      featuresToInsert.push(olFeature);
    });

    const payload = this.xs.serializeToString(this.getNode(TransactionType.INSERT, featuresToInsert, options));
    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  deleteFeatures(features: WfsFeature[], workspaceName: string, layerName: string) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresToDelete = [];
    features.forEach(feature => {
      const newFeatures = new Feature();
      newFeatures.setId(feature.id);

      featuresToDelete.push(newFeatures);
    });

    let payload = this.xs.serializeToString(this.getNode(TransactionType.DELETE, featuresToDelete, options));

    Object.keys(featuresToDelete).forEach(featureId => {
      payload = payload.replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');
    });

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  public splitListToParts(arr, n): [] {
    const plen = Math.ceil(arr.length / n);

    return arr.reduce(function (p, c, i, a) {
      if (i % plen === 0) {
        p.push([]);
      }

      p[p.length - 1][i] = c;

      return p;
    }, []);
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
