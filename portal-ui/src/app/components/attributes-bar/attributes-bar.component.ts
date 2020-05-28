import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';

import { openLayersService } from '../../services/open-layer/open-layers.service';
import { schemaService, FeatureDescription, PropertySchema } from '../../services/crg/schema.service';
import { sideBarManager, ActionType, SidebarType } from '../../services/side-bar-manager.service';
import { CrgModels, FilterEvent, Pageable, Sortable } from '../../services/crg/models';
import { getFeatures } from '../../services/geoserver/wfs.service';
import { WfsFeature, WfsFeatureCollection } from '../../services/geoserver/wfs-models';
import { projectsService } from '../../services/crg/projects.service';
import { EditFeatureMode } from '../edit-feature/edit-feature.component';
import { ValueTitleProjection } from '../../services/geoserver/projections';
import { AttributeTableViewSettings, ViewMode } from './attribute.settings';
import { ViewFeaturesData } from '../view-features/view-features.component';
import { communicationService } from '../../services/communication.service';
import { CrgLayer } from '../../services/crg/projects.models';
import { TransformFeatureService } from '../../services/geoserver/transform-feature.service';
import { CopyFeaturesDialogComponent } from '../dialogs/copy-features-dialog/copy-features-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { Toast } from '../Toast/Toast';
import { BatchModel } from '../../services/crg/batch-model';
import { ValueType } from '../../services/util/FeaturePropertyValidators';
import { currentProject } from '../../stores/CurrentProject.store';

export interface WfsFeatureView extends WfsFeature {
  aliases?: {};
  updated?: string;
}

@Component({
  selector: 'crg-attributes-bar',
  templateUrl: './attributes-bar.component.html',
  styleUrls: ['./attributes-bar.component.scss']
})
export class AttributesBarComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() layer: CrgLayer;

  @ViewChild(DatatableComponent, {static: true}) attributeTable: DatatableComponent;
  @ViewChild('filterTemplate', {static: true}) filterTemplate: TemplateRef<any>;
  @ViewChild('cellTemplate', {static: true}) cellTemplate: TemplateRef<any>;
  @ViewChild('customSelectAll', {static: true}) customSelectAll: TemplateRef<any>;

  isNeedPrepareColumn = true;

  currentPositionFeature: WfsFeature;
  features: WfsFeatureView[] = [];
  totalFeatures: number;
  columns: TableColumn[] = [];
  customRowIdentity = ((row: WfsFeature) => row.id);
  pageInfo: Pageable = {
    pageSize: 25,
    offset: 0
  };

  enableFilter = false;
  loading = true;
  viewSettings: AttributeTableViewSettings = {
    viewMode: ViewMode.alias
  };

  tableMessages = {
    emptyMessage: 'Нет данных для отображения',
    totalMessage: 'всего',
    selectedMessage: 'выбрано'
  };
  isSelectAll = false;

  loadPercent = 0;
  showPercent = true;
  readOnly: boolean;

  private schema: FeatureDescription;
  private requestModel$: BehaviorSubject<CrgModels> = new BehaviorSubject<CrgModels>({});
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private tFeatureService: TransformFeatureService,
              private logger: NGXLogger,
              private dialog: MatDialog) {
  }

  async ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));

    await projectsService.fetchCurrent();

    this.requestModel$
        .pipe(
          debounceTime(50),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((requestModel: CrgModels) => {
          this.updateTable(requestModel);
        });

    communicationService.featuresUpdate$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          // TODO: Самы простой вариант с лишним запросом. Заменить на обновление данных без запроса.
          const lastRequest = this.requestModel$.getValue();
          this.updateTable(lastRequest);
        });
  }

  async ngOnChanges(changes: SimpleChanges) {
    const layerChanged = changes.layer;
    const layer = layerChanged.currentValue as CrgLayer;
    this.schema = await schemaService.getSchema(layer.schemaId);
    this.readOnly = this.schema && this.schema.readOnly;

    if (layerChanged && !layerChanged.isFirstChange()) {
      this.isNeedPrepareColumn = true;
      this.requestModel$.next({page: {pageSize: 25, offset: 0}});

      this.attributeTable.selected = [];
      openLayersService.clearDraft();
      this.updateTable({page: {pageSize: 25, offset: 0}});
    }
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);

    openLayersService.clearDraft();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateTable(requestModel?: CrgModels) {
    this.loading = true;
    this.showPercent = false;
    getFeatures(this.layer.complexName, requestModel)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((fCollection: WfsFeatureCollection) => {
          if (fCollection) {
            this.loading = false;
            this.totalFeatures = fCollection.totalFeatures;

            if (this.isNeedPrepareColumn) {
              // TODO: новый запрос в пределах того же слоя не принесет новых колонок! Формировать колонки только
              //  при открытии или при переходе на новый слой
              this.prepareColumns(fCollection.features[0]);
              this.isNeedPrepareColumn = false;
            }

            this.features = fCollection.features.map((feature: WfsFeature) => {
              const wfsFeatureView: WfsFeatureView = feature;
              wfsFeatureView.aliases = this.fillAliases(feature.properties);

              return wfsFeatureView;
            });
          } else {
            this.logger.warn('Unexpected response:', fCollection);
          }
        });
  }

  showSelectedFeatures() {
    // Подсвечиваем выделенные если есть
    if (this.attributeTable.selected.length > 0) {
      openLayersService.highlightFeature(this.attributeTable.selected);
    }

    window.dispatchEvent(new Event('resize'));
  }

  setPage(pageInfo: Pageable) {
    this.pageInfo = pageInfo;

    const oldRequest = this.requestModel$.getValue();
    oldRequest.page = pageInfo;

    this.requestModel$.next(oldRequest);
  }

  onSort(sortInfo: Sortable) {
    const oldRequest = this.requestModel$.getValue();
    oldRequest.page.offset = 0;
    oldRequest.sort = sortInfo;

    this.requestModel$.next(oldRequest);
  }

  switchFilter() {
    this.enableFilter = !this.enableFilter;

    if (!this.enableFilter) {
      const oldRequest = this.requestModel$.getValue();
      oldRequest.page.offset = 0;
      oldRequest.filter = [];

      this.requestModel$.next(oldRequest);
    }

    // костыль для того, чтобы заставить datatable пересчитать свои размеры
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  getSimpleProperty(name: string): PropertySchema | undefined {
    if (!name) {
      return;
    }

    if (this.schema) {
      return this.schema.properties.find(property => property.name.toLowerCase() === name.toLowerCase());
    }
  }

  closeMe() {
    openLayersService.clearDraft();
    sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  onFilterChange(filterEvent: FilterEvent) {
    const oldRequest = this.requestModel$.getValue();
    oldRequest.page.offset = 0;

    const oldFilter = oldRequest.filter;

    if (oldFilter) {
      let isNotExist = true;
      oldFilter.forEach((oldFilterEvent: FilterEvent, index) => {
        if (oldFilterEvent && oldFilterEvent.property && oldFilterEvent.property.name === filterEvent.property.name) {
          isNotExist = false;
          if (filterEvent.value.length === 0) {
            oldFilter.splice(index, 1);
          } else {
            oldFilterEvent.value = filterEvent.value;
          }
        }
      });

      if (isNotExist) {
        if (filterEvent.value.length > 0) {
          oldFilter.push(filterEvent);
        }
      }
    } else {
      oldRequest.filter = [filterEvent];
    }

    this.requestModel$.next(oldRequest);
  }

  onActivate(event: any) {
    if (event.type === 'dblclick') {
      this.currentPositionFeature = event.row;

      openLayersService.highlightFeature(event.row);
      openLayersService.positionToFeature(event.row);
    }
  }

  handleSelectAll() {
    if (this.features.length === 0) {
      return;
    }

    this.isSelectAll = !this.isSelectAll;
    if (this.isSelectAll) {
      const currentRequestModel = this.requestModel$.getValue();
      const clonedRequestModel: CrgModels = cloneDeep(currentRequestModel);
      clonedRequestModel.page = undefined;

      this.loading = true;
      this.showPercent = false;
      getFeatures(this.layer.complexName, clonedRequestModel)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(fCollection => {
            this.attributeTable.selected = fCollection.features;
            this.loading = false;

            this.showSelectedFeatures();
          });
    } else {
      this.attributeTable.selected = [];
      openLayersService.clearDraft();
    }
  }

  private checkSelectionEmptiness(selected: any[]) {
    if (!selected.length) {
      Toast.warn('Нет выделенных объектов');
      return true;
    } else {
      return false;
    }
  }

  editFeatures() {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    // В таблице выводился нормальный id без перфикса фичи. Теперь верну эту инфу назад.
    const clonedFeatures: WfsFeature[] = cloneDeep(selected);
    clonedFeatures.forEach((feature: WfsFeature) => {
      feature.id = this.layer.internalName + '.' + feature.id;
    });
    // Отсылка в сайдбар
    sideBarManager.do({
      target: SidebarType.FEATURES, action: ActionType.OPEN,
      data: {
        features: clonedFeatures,
        mode: clonedFeatures.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single
      } as ViewFeaturesData
    });
  }

  async copyObjects() {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const layers = await this.getSuitableLayers(this.layer, currentProject.layers);
    if (this.isSuitableLayersExist(layers)) {
      this.openEditDialog('Копирование', layers)
        .pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((selectedLayer: CrgLayer) => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchInsertFeatures(selectedLayer, batchModel);
        });
    }
  }

  async moveObjects() {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const layers = await this.getSuitableLayers(this.layer, currentProject.layers);
    if (this.isSuitableLayersExist(layers)) {
      this.openEditDialog('Перемещение', layers)
        .pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((selectedLayer: CrgLayer) => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchReplaceFeatures(selectedLayer, batchModel);
        });
    }
  }

  deleteObjects() {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const data: ConfirmDialogData = {
      title: 'Удалить выделенные объекты?',
      approveBtnName: 'Удалить'
    };

    this.dialog
        .open(ConfirmDialogComponent, {width: '400px', data: data})
        .afterClosed().pipe(filter(value => !!value))
        .subscribe(() => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchDeleteFeatures(batchModel);
          this.attributeTable.selected = [];
        });
  }

  private async getSuitableLayers(currentLayer: CrgLayer, layers: CrgLayer[]): Promise<CrgLayer[]> {
    const schemas = await Promise.all(layers.map(({ schemaId }) => schemaService.getSchema(schemaId)));
    const currentSchema = await schemaService.getSchema(currentLayer.schemaId);

    return layers.filter(({ complexName }, i) => {
      if (!schemas[i]) {
        return false;
      }

      const { readOnly, geometryType } = schemas[i];

      return (currentLayer.complexName !== complexName) && (currentSchema.geometryType === geometryType) && !readOnly;
    });
  }

  private openEditDialog(title: string, layers: CrgLayer[]): Observable<CrgLayer> {
    return this.dialog
               .open(CopyFeaturesDialogComponent, {
                 data: {
                   title: title,
                   layers: layers,
                   objects: this.attributeTable.selected,
                 }
               })
               .afterClosed()
               .pipe(filter(value => !!value));
  }

  private prepareBatchProcess(selectedFeatures: WfsFeature[]): BatchModel<WfsFeature> {
    this.loading = true;
    this.showPercent = true;
    this.loadPercent = 0;

    return new BatchModel(selectedFeatures);
  }

  private batchInsertFeatures(selectedLayer: CrgLayer, batchModel: BatchModel<WfsFeature>) {
    let i = 0;
    from(batchModel.batches)
      .pipe(
        concatMap(features => this.tFeatureService.insertFeatures(features, currentProject.internalName, selectedLayer.internalName)),
        catchError(err => this.handleError(err)),
      ).subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;
          Toast.info('Объекты скопированы');
          this.attributeTable.selected = [];
          this.updateTable(this.requestModel$.getValue());
          openLayersService.clearDraft();
        } else {
          this.loadPercent = percent > 100 ? 100 : percent;
        }
      });
  }

  private batchReplaceFeatures(selectedLayer: CrgLayer, batchModel: BatchModel<WfsFeature>) {
    let i = 0;
    from(batchModel.batches)
      .pipe(
        concatMap(features => {
          return combineLatest(
            of(features),
            this.tFeatureService.insertFeatures(features, currentProject.internalName, selectedLayer.internalName)
          );
        }),
        concatMap(([features]) => {
          const featureIds = features.map((feature) => feature.id)

          return this.tFeatureService.deleteFeatures(featureIds, currentProject.internalName, this.layer.internalName);
        }),
        catchError(err => this.handleError(err)),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;
          Toast.info('Объекты перемещены');

          this.updateTable(this.requestModel$.getValue());
        } else {
          this.loadPercent = percent > 100 ? 100 : percent;
        }
      });
  }

  private batchDeleteFeatures(batchModel: BatchModel<WfsFeature>) {
    let i = 0;
    from(batchModel.batches)
      .pipe(
        concatMap(features => {
          const featureIds = features.map((feature) => feature.id)

          return this.tFeatureService.deleteFeatures(featureIds, currentProject.internalName, this.layer.internalName);
        }),
      ).subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;

          Toast.info('Объекты удалены');
          openLayersService.clearDraft();
          openLayersService.refreshLayers();

          this.updateTable(this.requestModel$.getValue());
        } else {
          this.loadPercent = percent > 100 ? 100 : percent;
        }
      });
  }

  private handleError(reason: string) {
    this.loading = false;
    const message = 'Не удалось переместить.';
    Toast.warn(message);
    this.logger.error(message, reason);

    return of();
  }

  private prepareColumns(wfsFeature: WfsFeature) {
    this.columns = [
      {
        name: '',
        prop: '',
        sortable: false,
        resizeable: false,
        width: 12,
        maxWidth: 12,
        cellTemplate: this.cellTemplate
      },
      {
        name: '',
        prop: 'checkboxable',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizeable: false,
        width: 22,
        maxWidth: 22,
        checkboxable: true,
        headerTemplate: this.customSelectAll
      },
      {
        name: this.viewSettings.viewMode === ViewMode.internal ? 'ID' : 'Идентификатор',
        prop: 'id',
        sortable: false,
        resizeable: false,
        width: 100,
        maxWidth: 100,
        headerTemplate: this.filterTemplate,
        // summaryTemplate: this.headerFilterTemplate
      }
    ];

    if (wfsFeature) {
      Object.keys(wfsFeature.properties).forEach(property => {
        if (property !== 'bbox') {
          const newProperty: TableColumn = {
            name: this.defineColumnName(property),
            prop: this.definePropertySource(property),
            headerTemplate: this.filterTemplate,
          };

          if (property.toLowerCase() === 'globalid') {
            newProperty.width = 300;
            newProperty.resizeable = false;
          }

          this.columns.push(newProperty);
        }
      });
    } else {
      console.warn('No wfsFeature');
    }
  }

  private fillAliases(properties: {[key: string]: any}): {} {
    const resultObject: {[key: string]: any} = {};

    Object.keys(properties).forEach(property => {
      const simpleProperty = this.getSimpleProperty(property);

      if (!simpleProperty) {
        return;
      }

      if (simpleProperty.valueType === ValueType.CHOICE) {
        if (this.viewSettings.viewMode === ViewMode.internal) {
          resultObject[property] = properties[property];
        } else {
          const valueTitle = this.getValueTitle(properties[property], simpleProperty.enumerations);
          if (valueTitle) {
            resultObject[property] = valueTitle;
          }
        }
      } else if (simpleProperty.valueType === ValueType.DATETIME) {
        if (!simpleProperty.dateFormat) {
          resultObject[property] = new Date(properties[property]).toLocaleDateString();
        } else {
          resultObject[property] = moment().locale('ru').format(simpleProperty.dateFormat);
        }
      } else {
        resultObject[property] = properties[property];
      }
    });

    return resultObject;
  }

  private getValueTitle(value: string, enumerations: ValueTitleProjection[]): string {
    let result = value;
    enumerations.forEach((item: ValueTitleProjection) => {
      if (!item || !value) {
        return;
      }

      if (item.value.toString() === value.toString()) {
        result = item.title;
      }
    });

    return result;
  }

  private definePropertySource(property: string) {
    if (this.viewSettings.viewMode === ViewMode.internal) {
      return 'properties.' + property;
    } else if (this.viewSettings.viewMode === ViewMode.alias) {
      return 'aliases.' + property;
    }

    return 'properties.' + property;
  }

  private defineColumnName(property: string) {
    let result = property;
    if (this.viewSettings.viewMode === ViewMode.alias) {
      const simpleProperty = this.getSimpleProperty(property);
      if (simpleProperty) {
        result = simpleProperty.title;
      }
    }

    return result;
  }

  private isSuitableLayersExist(suitableLayers: CrgLayer[]) {
    if (!!suitableLayers.length) {
      return true;
    } else {
      Toast.warn('Нет подходящих слоев');
      return false;
    }
  }
}
