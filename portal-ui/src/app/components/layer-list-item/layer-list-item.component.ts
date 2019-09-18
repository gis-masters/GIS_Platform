import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subject, forkJoin, Observable} from 'rxjs';
import {filter, takeUntil, map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';

import { environment } from '../../../environments/environment';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {ExportService} from '../../services/crg/export.service';
import {LegendService} from '../../services/geoserver/legend.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {StringUtil} from '../../services/util/StringUtil';
import {cn} from '../../services/util/cn';
import {ConfirmDialogComponent, ConfirmDialogData} from '../dialogs/confirm-dialog/confirm-dialog.component';
import { StylesService } from '../../services/geoserver/styles.service';
import { LayersService } from '../../services/geoserver/layers.service';

interface Rule {
  name: string;
  title: string;
}

interface RuleWithLegend extends Rule {
  legend: string;
}

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

  isSimf: boolean = environment.platform === 'simf';

  contextMenuPosition: {x: string, y: string} = { x: '0px', y: '0px' };

  cn = cn('layer-list-item');

  open: boolean = false;

  rules: RuleWithLegend[] = [];

  get visible (): boolean {
    return this.openLayers.getLayerVisibility(this.layer.complexName);
  }

  set visible (visible: boolean) {
    this.openLayers.setLayerVisibility(this.layer.complexName, visible);
    if (!visible) {
      this.open = false;
    }
  }

  get opacity (): number {
    return this.openLayers.getLayerOpacity(this.layer.complexName);
  }

  set opacity (opacity: number) {
    this.openLayers.setLayerOpacity(this.layer.complexName, opacity);
  }

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private legendService: LegendService,
              private exportService: ExportService,
              private sideBarManager: SideBarManager,
              private dialog: MatDialog,
              private openLayers: OpenLayersService,
              private stylesService: StylesService,
              private layersService: LayersService) { }

  ngOnInit(): void {
    this.layersService.getFullLayer(this.layer).subscribe(({layer}) => {
      const layerName = layer.defaultStyle.name.split(':').pop();

      this.stylesService.getStyleSld(layerName).subscribe((styleSld: string) => {
        const xmlDoc = new DOMParser().parseFromString(styleSld, "text/xml");
        const rules: Rule[] = Array.from(xmlDoc.querySelectorAll('Rule'))
          .filter(rule => rule.querySelector('Name') && rule.querySelector('Title'))
          .map(rule => {
            const name = rule.querySelector('Name').innerHTML;
            return {
              name,
              title: rule.querySelector('Title').innerHTML
            }
          });

          forkJoin(rules.map(({ name }) => {
            return this.legendService.getLegendGraphicByRuleName(this.layer.complexName, name);
          })).subscribe((arr)=>{
            forkJoin(arr.map(blob => this.createImageFromBlob(blob))).subscribe(imgs => {
              this.rules = rules.map((rule, i) => ({
                ...rule,
                legend: imgs[i]
              }))
            })
          })
      });

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

  toggleVisibility () {
    this.visible = !this.visible;
  }

  toggleOpenness () {
    this.open = !this.open;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private createImageFromBlob(image: Blob): Observable<string> {
    return new Observable(sub => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        sub.next(reader.result as string);
        sub.complete();
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    });
  }
}
