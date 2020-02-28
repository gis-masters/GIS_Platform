import { Component, Input, OnInit } from '@angular/core';

import { openLayersService, TileSource } from '../../services/open-layer/open-layers.service';

@Component({
  selector: 'crg-tile-source-select',
  templateUrl: './tile-source-select.component.html',
  styleUrls: ['./tile-source-select.component.scss']
})
export class TileSourceSelectComponent implements OnInit {
  selectedTileSource: TileSource;

  @Input() class: string;

  get tileSources (): TileSource[] {
    return openLayersService.getTileSources();
  }

  ngOnInit () {
    this.selectedTileSource = openLayersService.getCurrentTileSource();
  }

  onChange () {
    if (openLayersService.getCurrentTileSource().name !== this.selectedTileSource.name) {
      openLayersService.setTileSource(this.selectedTileSource);
    }
  }
}
