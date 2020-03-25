import { Component, Input, OnInit } from '@angular/core';

import { baseMapsStore } from '../../stores/BaseMaps.store';
import { CrgBaseMap } from '../../services/crg/base-maps.models';
import {reaction} from 'mobx';

@Component({
  selector: 'crg-tile-source-select',
  templateUrl: './tile-source-select.component.html',
  styleUrls: ['./tile-source-select.component.scss']
})
export class TileSourceSelectComponent implements OnInit {
  selectedBaseMap: CrgBaseMap | undefined;

  @Input() class: string;

  ngOnInit () {
    reaction(() => baseMapsStore.getCurrentBaseMap, baseMap => {
      this.selectedBaseMap = baseMap;
    });
  }

  onChange () {
    if (!this.selectedBaseMap) {
      return;
    }

    if (baseMapsStore.getCurrentBaseMap.name !== this.selectedBaseMap.name) {
      baseMapsStore.setBaseMap(this.selectedBaseMap);
    }
  }

  get tileSources (): CrgBaseMap[] {
    return baseMapsStore.baseMaps();
  }

}
