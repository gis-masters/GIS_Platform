import {Component, EventEmitter, Input, Output} from '@angular/core';

import {CrgLayer} from '../../services/geoserver/layers.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {cn} from '../../services/util/cn';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.scss']
})
export class LayersSidebarComponent {
  @Input() layers: CrgLayer[];
  @Output() deleteLayer = new EventEmitter<CrgLayer>();

  isOpen: boolean = true;

  cn = cn('layers-sidebar');

  constructor(private openLayers: OpenLayersService) { }

  toggleOpen () {
    this.isOpen = !this.isOpen;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.layers.forEach((layer, index) => {
      this.openLayers.set_ZIndex(layer.complexName, this.layers.length - index);
    });
  }

  onDeleteLayer (layer: CrgLayer) {
    this.deleteLayer.emit(layer);
  }
}
