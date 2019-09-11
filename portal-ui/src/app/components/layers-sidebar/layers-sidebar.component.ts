import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.scss']
})
export class LayersSidebarComponent {

  @Input() isActive: boolean;
  @Input() layers: CrgLayer[];
  @Output() deleteLayer = new EventEmitter<CrgLayer>();

  constructor(private openLayers: OpenLayersService) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.layers.forEach((layer, index) => {
      this.openLayers.set_ZIndex(layer.complexName, this.layers.length - index);
    });
  }

  handleSelection(selectionList: MatSelectionList) {
    let nameOfSelectedLayers: string[];
    nameOfSelectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value)
      .map((layer: CrgLayer) => layer.complexName);

    this.openLayers.changeLayersVisibility(nameOfSelectedLayers);
  }

  onDeleteLayer (layer: CrgLayer) {
    this.deleteLayer.emit(layer);
  }
}
