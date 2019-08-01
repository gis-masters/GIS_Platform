import {Pipe, PipeTransform} from '@angular/core';
import {FeatureDescription} from '../services/crg/fgistp-rules.service';
import {FeatureDescriptionUtil} from '../services/util/FeatureDescriptionUtil';
import {ImportLayerItem} from '../services/geoserver/import/import.service';

@Pipe({
  name: 'geometry'
})
export class GeometryPipe implements PipeTransform {

  transform(featuresDescription: FeatureDescription[], importLayer?: ImportLayerItem): FeatureDescription[] {
    const geometryName = FeatureDescriptionUtil.getLayerGeometry(importLayer);

    return featuresDescription.filter((featureDescription: FeatureDescription) => {
      return FeatureDescriptionUtil.isFeatureGeometryCompatible(geometryName, featureDescription);
    });
  }

}
