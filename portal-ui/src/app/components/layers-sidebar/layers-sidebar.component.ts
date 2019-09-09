import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatMenuTrigger } from '@angular/material/menu';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {ExportService} from '../../services/crg/export.service';
import {Process} from '../../services/crg/models';
import {CommunicationService} from '../../services/communication.service';
import {filter, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogData} from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.css']
})
export class LayersSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;
  @Input() layers: CrgLayer[];
  @Output() deleteLayer = new EventEmitter<CrgLayer>();

  @ViewChild(MatMenuTrigger, { static: false })
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  private unsubscribe$: Subject<void> = new Subject<void>();
  private selectedLayer: CrgLayer;

  constructor(private logger: NGXLogger,
              private exportService: ExportService,
              private openLayers: OpenLayersService,
              private dialog: MatDialog,
              private communicationService: CommunicationService,
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

  onContextMenu(event: MouseEvent, layer: CrgLayer) {
    event.preventDefault();

    this.selectedLayer = layer;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  openAttributeTable() {
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.OPEN, data: this.selectedLayer});
  }

  export() {
    if (this.selectedLayer) {
      this.exportService
          .export({format: 'ESRI Shapefile', layers: [this.selectedLayer.name]})
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((process: Process) => {
            // TODO: Ответ пойдет по вебсокету, но здесь его нужно подстраховать
            this.logger.info('export shape:', process);

            this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.OPEN});
          });
    } else {
      this.logger.warn('Empty selected layer: ', this.selectedLayer);
    }
  }

  delete() {
    if (this.selectedLayer) {
      const dialogData: ConfirmDialogData = {
        title: 'Удалить слой: ' + this.selectedLayer.title,
        approveBtnName: 'Удалить'
      };

      this.dialog
          .open(ConfirmDialogComponent, {width: '400px', data: dialogData})
          .afterClosed().pipe(filter(value => !!value))
          .subscribe(() => {
            this.deleteLayer.emit(this.selectedLayer);
          });
    } else {
      this.logger.warn('Empty selected layer: ', this.selectedLayer);
    }
  }
}
