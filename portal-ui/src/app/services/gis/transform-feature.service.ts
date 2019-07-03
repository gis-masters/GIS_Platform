import {Feature} from 'ol';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
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

    const node = this.formatWFS.writeTransaction(null, [featureClone], null, options);
    const payload = this.xs.serializeToString(node)
                           .replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  updateFeatures(featuresId: {}, workspaceName: string, layerName: string, newProperties: any) {
    const options = {
      featureNS: 'castyl_for_remove',
      featureType: layerName,
      featurePrefix: workspaceName,
      nativeElements: []
    } as WriteTransactionOptions;

    const featuresForUpdate = [];
    Object.keys(featuresId).forEach(featureId => {
      const features = new Feature(newProperties);
      features.setId(featureId);

      featuresForUpdate.push(features);
    });

    const node = this.formatWFS.writeTransaction(null, featuresForUpdate, null, options);
    let payload = this.xs.serializeToString(node);

    Object.keys(featuresId).forEach(featureId => {
      payload = payload.replace('xmlns:' + workspaceName + '="castyl_for_remove"', '');
    });

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

}
