import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ActionType, SideBarManager, SidebarType } from '../../services/side-bar-manager.service';
import { CrgLayer, LayersService } from '../../services/geoserver/layers.service';
import { ExportService } from '../../services/crg/export.service';
import { LegendService } from '../../services/geoserver/legend.service';
import { OpenLayersService } from '../../services/open-layer/open-layers.service';
import { cn } from '../../services/util/cn';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { EditFeatureMode } from '../edit-feature/edit-feature.component';
import { StylesService } from '../../services/geoserver/styles.service';
import { getEnvironment } from '../../services/environment';
import { ViewFeaturesData } from '../view-features/view-features.component';
import { DataSchemaService } from '../../services/crg/data-schema.service';

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
export class LayerListItemComponent implements OnDestroy {

  @Input() layer: CrgLayer;
  @Output() deleteLayer = new EventEmitter<CrgLayer>();

  @ViewChild(MatMenuTrigger, { static: false })
  contextMenu: MatMenuTrigger;

  isSimf: boolean = false;

  contextMenuPosition: {x: string, y: string} = { x: '0px', y: '0px' };

  cn = cn('layer-list-item');

  rules: RuleWithLegend[];

  open = false;

  private legendLoaded: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  get visible (): boolean {
    return this.openLayers.getLayerVisibility(this.layer.complexName);
  }

  set visible (visible: boolean) {
    this.openLayers.setLayerVisibility(this.layer.complexName, visible);
    if (!visible) {
      this.open = false;
    }
    this.loadLegend();
  }

  get opacity (): number {
    return this.openLayers.getLayerOpacity(this.layer.complexName);
  }

  set opacity (opacity: number) {
    this.openLayers.setLayerOpacity(this.layer.complexName, opacity);
  }

  constructor(private legendService: LegendService,
              private exportService: ExportService,
              private sideBarManager: SideBarManager,
              private dialog: MatDialog,
              private openLayers: OpenLayersService,
              private stylesService: StylesService,
              private layersService: LayersService,
              private dataSchemaService: DataSchemaService) {
    this.getEnv();
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

  async export() {
    await this.exportService.export({format: 'ESRI Shapefile', layers: [this.layer.name]});
    // TODO: Ответ пойдет по вебсокету, но здесь его нужно подстраховать
    this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.OPEN});
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

  addFeature () {
    const emptyFeature = this.dataSchemaService.getEmptyFeature(this.layer);

    this.sideBarManager.do({
      target: SidebarType.FEATURES, action: ActionType.OPEN,
      data: {
        features: [emptyFeature],
        mode: EditFeatureMode.single,
        layer: this.layer,
        isNew: true
      } as ViewFeaturesData
    });
  }

  private async getEnv () {
    const environment = await getEnvironment();
    this.isSimf = environment.platform === 'simf';
  }

  private loadLegend () {
    if (this.legendLoaded) return;
    this.legendLoaded = true;

    this.layersService.getFullLayer(this.layer).subscribe(async ({layer}) => {
      const styleSld: string = await this.stylesService.getStyleSld(layer.defaultStyle.name);
      const xmlDoc = new DOMParser().parseFromString(styleSld, 'text/xml');
      const rules: Rule[] = Array.from(xmlDoc.querySelectorAll('Rule'))
        .filter(rule => rule.querySelector('Name') && rule.querySelector('Title'))
        .map(rule => {
          const name = rule.querySelector('Name').innerHTML;

          return {
            name,
            title: rule.querySelector('Title').innerHTML
          };
        });

      forkJoin(rules.map(({ name }) => {
        return this.legendService.getLegendGraphicByRuleName(this.layer.complexName, name);
      })).subscribe((arr) => {
        forkJoin(arr.map(blob => this.createImageFromBlob(blob))).subscribe(imgs => {
          this.rules = rules.map((rule, i) => ({
            ...rule,
            legend: imgs[i]
          }));
        });
      });
    });
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
