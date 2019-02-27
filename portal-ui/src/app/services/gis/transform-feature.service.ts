import {Injectable} from '@angular/core';
import WFS from 'ol/format/WFS.js';
import GML from 'ol/format/GML.js';
import Feature from 'ol/Feature.js';
import {NGXLogger} from 'ngx-logger';
import {ServerPropertiesService} from '../server-properties.service';
import {HttpClient} from '@angular/common/http';

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

  updateFeature(feature: Feature, newProperties: any, workspace: string, featureType: string) {
    const gmlFormat = this.prepareGMLOptions(workspace, featureType);

    // let featureProperties = feature.properties;
    // this.prepareProperties(featureProperties, newProperties);

    const featureClone = new Feature(newProperties);
    featureClone.setId(feature.id);

    const node = this.formatWFS.writeTransaction(null, [featureClone], null, gmlFormat);
    const payload = this.xs.serializeToString(node)
                           .replace('xmlns:' + workspace + '="castyl_for_remove"', '');

    this.logger.info('Transaction payload: ', payload);

    return this.http
               .post(this.wfsUrl, payload, {headers: {'Content-Type': 'text/xml'}, responseType: 'text'});
  }

  private prepareGMLOptions(workspace, featureType) {
    return {
      featureNS: 'castyl_for_remove',
      featureType: featureType,
      featurePrefix: workspace
    };
  }

  // private prepareProperties(oldProp: any, newProp: Map<string, string>) {
  //   delete oldProp.bbox;
  //
  //   newProp.forEach((value, key) => oldProp[key] = value);
  // }
}
