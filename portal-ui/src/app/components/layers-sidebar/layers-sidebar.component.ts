import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { cn } from '../../services/util/cn';
import { CrgLayer } from '../../services/crg/projects.models';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.scss']
})
export class LayersSidebarComponent implements OnInit {
  @Input() layers: CrgLayer[];
  @Output() deleteLayer = new EventEmitter<CrgLayer>();

  isOpen = true;

  cn = cn('layers-sidebar');

  ngOnInit () {
    window.dispatchEvent(new Event('resize'));
  }

  toggleOpen () {
    this.isOpen = !this.isOpen;

    const animDuration = 300;

    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
    }, 20);

    setTimeout(() => {
      clearInterval(interval);
    }, animDuration);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.layers.forEach((layer, index) => {
      openLayersService.set_ZIndex(layer.complexName, this.layers.length - index);
    });
  }

  onDeleteLayer (layer: CrgLayer) {
    this.deleteLayer.emit(layer);
  }
}
