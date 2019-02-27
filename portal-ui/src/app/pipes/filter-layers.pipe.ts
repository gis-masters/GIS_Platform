import {Pipe, PipeTransform} from '@angular/core';
import {CrgLayer} from '../services/geoserver/layers.service';

@Pipe({
  name: 'filterLayers'
})
export class FilterLayersPipe implements PipeTransform {

  transform(layers: CrgLayer[], filterTerm: string): any {
    if (!layers || !filterTerm) {
      return layers;
    }

    return layers.filter((layer: CrgLayer) =>
      layer.title.toLocaleLowerCase().indexOf(filterTerm.toLocaleLowerCase()) !== -1);
  }

}
