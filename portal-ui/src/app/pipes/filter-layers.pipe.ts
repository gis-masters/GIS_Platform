import {Pipe, PipeTransform} from '@angular/core';
import {NameHrefProjection} from "../services/geoserver/projections";

@Pipe({
  name: 'filterLayers'
})
export class FilterLayersPipe implements PipeTransform {

  transform(layers: NameHrefProjection[], filterTerm: string): any {
    if (!layers || !filterTerm) {
      return layers;
    }

    return layers.filter((layer: NameHrefProjection) =>
      layer.name.toLocaleLowerCase().indexOf(filterTerm.toLocaleLowerCase()) !== -1);
  }

}
