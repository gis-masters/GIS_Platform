import {Pipe, PipeTransform} from '@angular/core';
import {FeatureDescription} from '../services/crg/data-schema.service';
import {FeatureUtil} from '../services/util/FeatureUtil';
import {ImportLayerItem} from '../services/geoserver/import/models';

@Pipe({
  name: 'geometry'
})
export class GeometryPipe implements PipeTransform {

  transform(featuresDescription: FeatureDescription[], importLayer?: ImportLayerItem): FeatureDescription[] {
    const geometryName = FeatureUtil.getLayerGeometry(importLayer);

    return featuresDescription.filter((featureDescription: FeatureDescription) => {
      return FeatureUtil.isFeatureGeometryCompatible(geometryName, featureDescription);
    });
  }

}
