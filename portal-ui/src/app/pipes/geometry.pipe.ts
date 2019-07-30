import {Pipe, PipeTransform} from '@angular/core';
import {FeatureDescription} from '../services/crg/fgistp-rules.service';
import {FeatureDescriptionUtil} from '../services/util/FeatureDescriptionUtil';
import {LayerItem} from '../services/geoserver/import/import.service';

@Pipe({
  name: 'geometry'
})
export class GeometryPipe implements PipeTransform {

  transform(featuresDescription: FeatureDescription[], layer?: LayerItem): FeatureDescription[] {
    const layerGeometry = FeatureDescriptionUtil.getLayerGeometry(layer);
    const filtered = featuresDescription.filter((featureDescription: FeatureDescription) => {
      return FeatureDescriptionUtil.isFeatureGeometryCompatible(layerGeometry, featureDescription);
    });

    // console.log('Было: ' + featuresDescription.length + ' Стало: ' + filtered.length);

    return filtered;
  }

}
