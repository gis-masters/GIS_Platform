import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatListOption, MatMenuTrigger, MatSelectionList} from '@angular/material';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, SideBarManager, SidebarType} from "../../services/side-bar-manager.service";

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.css']
})
export class LayersSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;
  @Input() layers: CrgLayer[];

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private openLayers: OpenLayersService,
              private sideBarManager: SideBarManager) {
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.layers.forEach((layer, index) => {
      this.openLayers.set_ZIndex(layer.name, this.layers.length - index);
    });
  }

  handleSelection(selectionList: MatSelectionList) {
    let nameOfSelectedLayers: string[];
    nameOfSelectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value)
      .map((layer: CrgLayer) => layer.name);

    this.openLayers.changeLayersVisibility(nameOfSelectedLayers);
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  openAttributeTable(layer: CrgLayer) {
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.OPEN, data: layer});
  }

  ZoomTo(layer) {
    console.log('Not implemented yet...', layer);
  }
}
