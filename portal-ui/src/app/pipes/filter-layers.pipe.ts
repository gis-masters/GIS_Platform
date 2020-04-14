import { Pipe, PipeTransform } from '@angular/core';
import { CrgLayer } from '../services/crg/projects.models';

@Pipe({
  name: 'filterLayers'
})
export class FilterLayersPipe implements PipeTransform {

  transform(layers: CrgLayer[], filterTerm: string): CrgLayer[] {
    if (!layers || !filterTerm) {
      return layers;
    }

    return layers.filter((layer: CrgLayer) =>
      layer.title.toLocaleLowerCase().indexOf(filterTerm.toLocaleLowerCase()) !== -1);
  }

}
