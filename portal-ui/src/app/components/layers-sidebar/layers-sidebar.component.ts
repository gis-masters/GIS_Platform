import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {cn} from '../../services/util/cn';
import {CrgLayer} from '../../services/crg/projects.models';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.scss']
})
export class LayersSidebarComponent implements OnInit {
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

  onDeleteLayer (layer: CrgLayer) {
    this.deleteLayer.emit(layer);
  }
}
