import {Feature} from 'ol';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {WfsFeature} from './wfs.service';
import {HttpClient} from '@angular/common/http';
import WFS, {WriteTransactionOptions} from 'ol/format/WFS';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class TransformFeatureService {

  private wfsUrl = this.propertiesService.geoServerUrl + '/wfs';
  private xs = new XMLSerializer();
  private formatWFS = new WFS();

  constructor(private logger: NGXLogger,
              private http: HttpClient,
              private propertiesService: ServerPropertiesService) {
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

  deleteFeatures(features: WfsFeature[], workspaceName: string, layerName: string) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresToDelete = [];
    features.forEach(feature => {
      const opFeatures = new Feature();
      opFeatures.setId(feature.id);

      featuresToDelete.push(opFeatures);
    });

    let payload = this.xs.serializeToString(this.getNode(TransactionType.DELETE, featuresToDelete, options));

    Object.keys(featuresToDelete).forEach(featureId => {
      payload = payload.replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');
    });

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
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

export enum TransactionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}
