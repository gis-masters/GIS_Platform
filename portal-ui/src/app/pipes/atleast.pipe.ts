import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'atleast'
})
export class AtleastPipe implements PipeTransform {
  transform(val: number, marginVal: number): number {
    return marginVal > val ? marginVal : val;
  }
}
