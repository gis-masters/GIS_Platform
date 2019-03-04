import {Pipe, PipeTransform} from '@angular/core';
import {XsdFeature} from '../services/gis/fgistp-rules.service';
import {EntityTypesUtil} from '../services/util/EntityTypesUtil';
import {LayerItem} from '../services/geoserver/import/import.service';

@Pipe({
  name: 'geometry'
})
export class GeometryPipe implements PipeTransform {

  transform(entityTypes: XsdFeature[], layer?: LayerItem): any {
    const layerGeometry = EntityTypesUtil.getLayerGeometry(layer);
    const filtered = entityTypes.filter((entityType: XsdFeature) => {
      return EntityTypesUtil.isLayerGeometryCompatible(layerGeometry, entityType);
    });

    // console.log('Было: ' + entityTypes.length + ' Стало: ' + filtered.length);

    return filtered;
  }

}
