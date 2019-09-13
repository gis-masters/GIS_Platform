import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';

import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {ExportService} from '../../services/crg/export.service';
import {LegendService} from '../../services/geoserver/legend.service';
import {StringUtil} from '../../services/util/StringUtil';
import {ConfirmDialogComponent, ConfirmDialogData} from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'crg-layer-list-item',
  templateUrl: './layer-list-item.component.html',
  styleUrls: ['./layer-list-item.component.scss']
})
export class LayerListItemComponent implements OnInit, OnDestroy {

  @Input() layer: CrgLayer;
  @Output() deleteLayer = new EventEmitter<CrgLayer>();

  @ViewChild(MatMenuTrigger, { static: false })
  contextMenu: MatMenuTrigger;

  contextMenuPosition: {x: string, y: string} = { x: '0px', y: '0px' };

  imageToShow: any;
  isImageLoaded = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private legendService: LegendService,
              private exportService: ExportService,
              private sideBarManager: SideBarManager,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.legendService
        .getFullLegendGraphic(this.layer.complexName)
        .subscribe(data => {
          this.createImageFromBlob(data);
        });
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  openAttributeTable() {
    this.sideBarManager.do({
      target: SidebarType.ATTRIBUTES,
      action: ActionType.OPEN,
      data: this.layer
    });
  }

  export() {
    this.exportService
        .export({format: 'ESRI Shapefile', layers: [this.layer.name]})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          // TODO: Ответ пойдет по вебсокету, но здесь его нужно подстраховать
          this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.OPEN});
        });
  }

  delete() {
    const dialogData: ConfirmDialogData = {
      title: 'Удалить слой: ' + this.layer.title,
      approveBtnName: 'Удалить'
    };

    this.dialog
        .open(ConfirmDialogComponent, {width: '400px', data: dialogData})
        .afterClosed().pipe(filter(value => !!value))
        .subscribe(() => {
          this.deleteLayer.emit(this.layer);
        });
  }

  getGeometryType(name: string) {
    return StringUtil.splitGeomType(name);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
      this.isImageLoaded = true;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
