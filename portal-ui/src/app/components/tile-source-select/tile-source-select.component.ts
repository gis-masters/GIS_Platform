import { Component, Input, OnInit } from '@angular/core';

import { OpenLayersService, TileSource } from '../../services/open-layer/open-layers.service';

@Component({
  selector: 'crg-tile-source-select',
  templateUrl: './tile-source-select.component.html',
  styleUrls: ['./tile-source-select.component.scss']
})
export class TileSourceSelectComponent implements OnInit {
  selectedTileSource: TileSource;

  @Input() class: string;

  get tileSources (): TileSource[] {
    return this.openLayers.getTileSources();
  }

  constructor (private openLayers: OpenLayersService) { }

  ngOnInit () {
    this.selectedTileSource = this.openLayers.getCurrentTileSource();
  }

  onChange () {
    if (this.openLayers.getCurrentTileSource().name !== this.selectedTileSource.name) {
      this.openLayers.setTileSource(this.selectedTileSource);
    }
  }
}
