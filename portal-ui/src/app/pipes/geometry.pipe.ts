import {Pipe, PipeTransform} from '@angular/core';
import {EntityType} from "../services/gis/rules.service";
import {EntityTypesUtil} from "../services/util/EntityTypesUtil";
import {LayerItem} from "../services/geoserver/import.service";

@Pipe({
  name: 'geometry'
})
export class GeometryPipe implements PipeTransform {

  transform(entityTypes: EntityType[], layer?: LayerItem): any {
    let layerGeometry = EntityTypesUtil.getLayerGeometry(layer);
    let filtered = entityTypes.filter((entityType: EntityType) => {
      return EntityTypesUtil.isLayerGeometryCompatible(layerGeometry, entityType);
    });

    // console.log('Было: ' + entityTypes.length + ' Стало: ' + filtered.length);

    return filtered;
  }

}
