import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild, OnInit } from '@angular/core';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { MatDialog } from '@angular/material/dialog';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, takeUntil } from 'rxjs/operators';

import { Toast } from '../Toast/Toast';
import { schemaService } from '../../services/crg/schema.service';
import { FeatureDescription, ValueType, PropertyEnumerations, PropertySchema } from '../../services/crg/schema.models';
import { BatchModel } from '../../services/crg/batch-model';
import { CrgLayer } from '../../services/crg/projects.models';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { getFeatures } from '../../services/geoserver/wfs.service';
import { projectsService } from '../../services/crg/projects.service';
import { AttributeTableViewSettings, ViewMode } from './attribute.settings';
import { communicationService } from '../../services/communication.service';
import { mapService } from '../../services/map/map.service';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { CrgModels, FilterEvent, Pageable, Sortable } from '../../services/models';
import { WfsFeature, WfsFeatureCollection } from '../../services/geoserver/wfs.models';
import { isFeaturesUpdateAllowed, isFeaturesDeleteAllowed } from '../../services/crg/permissions.service';
import { CopyFeaturesDialogComponent } from '../dialogs/copy-features-dialog/copy-features-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { currentProject } from '../../stores/CurrentProject.store';
import { getProjection } from '../../services/geoserver/projections.service';
import { fromMobx } from '../../services/util/fromMobx';
import { generateFilter } from '../../services/geoserver/wfs.util';

export interface WfsFeatureView extends WfsFeature {
  aliases?: Record<string, unknown>;
  updated?: string;
}

export interface AttributeTableFilter {
  layerComplexName?: string;
  filter?: string;
}

@Component({
  selector: 'crg-attributes-bar',
  templateUrl: './attributes-bar.component.html',
  styleUrls: ['./attributes-bar.component.scss']
})
export class AttributesBarComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: true }) attributeTable: DatatableComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('filterTemplate', { static: true }) filterTemplate: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('cellTemplate', { static: true }) cellTemplate: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('customSelectAll', { static: true }) customSelectAll: TemplateRef<any>;

  layer?: CrgLayer;
  isNeedPrepareColumn = true;

  currentPositionFeature: WfsFeature;
  features: WfsFeatureView[] = [];
  totalFeatures: number;
  columns: TableColumn[] = [];
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

  deletingAllowed = false;
  updatingAllowed = false;

  private schema: FeatureDescription;
  private requestModel$: BehaviorSubject<CrgModels> = new BehaviorSubject<CrgModels>({});
  private unsubscribe$: Subject<void> = new Subject<void>();

  customRowIdentity(row: WfsFeature): string {
    return row.id;
  }

  constructor(private dialog: MatDialog, private logger: NGXLogger) {}

  ngOnInit() {
    fromMobx<CrgLayer>(() => sidebars.layerForAttributes, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async layer => {
        const layerChanged = (this.layer && this.layer.id) !== (layer && layer.id);

        this.layer = layer;

        if (layer && layerChanged) {
          this.schema = await schemaService.getSchema(layer.schemaId);
          this.isNeedPrepareColumn = true;
          this.requestModel$.next({ page: { pageSize: 25, offset: 0 } });

          this.attributeTable.selected = [];
          mapService.clearDraft();
          await this.updateTable({ page: { pageSize: 25, offset: 0 } });
          await this.checkPermissions();
        }
      });
  }

  async ngAfterViewInit() {
    await projectsService.fetchCurrent();

    this.requestModel$.pipe(debounceTime(50), takeUntil(this.unsubscribe$)).subscribe((requestModel: CrgModels) => {
      void this.updateTable(requestModel);
    });

    communicationService.featuresUpdated.on(async () => {
      // TODO: Самый простой вариант с лишним запросом. Заменить на обновление данных без запроса.
      const lastRequest = this.requestModel$.getValue();
      await this.updateTable(lastRequest);
    }, this);

    await this.checkPermissions();
  }

  ngOnDestroy() {
    mapService.clearDraft();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
  }

  async updateTable(requestModel?: CrgModels): Promise<void> {
    this.loading = true;
    this.showPercent = false;
    const fCollection: WfsFeatureCollection = await getFeatures(
      this.layer.complexName,
      requestModel,
      this.layer.nativeCRS
    );

    if (fCollection) {
      currentProject.updateAttributeTableFilter({
        layerComplexName: this.layer.complexName,
        filter: generateFilter(requestModel)
      });

      this.loading = false;
      this.totalFeatures = fCollection.totalFeatures;

      if (this.isNeedPrepareColumn) {
        // TODO: новый запрос в пределах того же слоя не принесет новых колонок! Формировать колонки только
        //  при открытии или при переходе на новый слой
        await this.prepareColumns(fCollection.features[0]);
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
  }

  showSelectedFeatures(): void {
    // Подсвечиваем выделенные если есть
    if (this.attributeTable.selected.length > 0) {
      mapService.highlightFeatures(this.attributeTable.selected, getProjection(this.layer.nativeCRS));
    }

    window.dispatchEvent(new Event('resize'));
  }

  setPage(pageInfo: Pageable): void {
    this.pageInfo = pageInfo;

    const oldRequest = this.requestModel$.getValue();
    oldRequest.page = pageInfo;

    this.requestModel$.next(oldRequest);
  }

  onSort(sortInfo: Sortable): void {
    const oldRequest = this.requestModel$.getValue();
    oldRequest.page.offset = 0;
    oldRequest.sort = sortInfo;

    this.requestModel$.next(oldRequest);
  }

  switchFilter(): void {
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

  closeMe(): void {
    mapService.clearDraft();
    sidebars.closeAttributes();
    currentProject.updateAttributeTableFilter({});
  }

  onFilterChange(filterEvent: FilterEvent): void {
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

      if (isNotExist && filterEvent.value.length > 0) {
        oldFilter.push(filterEvent);
      }
    } else {
      oldRequest.filter = [filterEvent];
    }

    this.requestModel$.next(oldRequest);
  }

  onActivate(event: { type: string; row: WfsFeature }): void {
    if (event.type === 'dblclick') {
      const feature: WfsFeature = event.row;
      if (feature.geometry) {
        this.currentPositionFeature = feature;
        const projection = getProjection(this.layer.nativeCRS);
        mapService.highlightFeatures([feature], projection);
        mapService.positionToFeature(feature, projection);
      } else {
        Toast.info(`У объекта [id:${feature.id}] отсутствует геометрия`);
      }
    }
  }

  async handleSelectAll(): Promise<void> {
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
      const fCollection: WfsFeatureCollection = await getFeatures(
        this.layer.complexName,
        clonedRequestModel,
        this.layer.nativeCRS
      );
      this.attributeTable.selected = fCollection.features;
      this.loading = false;

      this.showSelectedFeatures();
    } else {
      this.attributeTable.selected = [];
      mapService.clearDraft();
    }
  }

  editFeatures(): void {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    // В таблице выводился нормальный id без префикса фичи. Теперь верну эту инфу назад.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clonedFeatures: WfsFeature[] = cloneDeep(selected);
    clonedFeatures.forEach((feature: WfsFeature) => {
      feature.id = this.layer.tableName + '.' + feature.id;
    });
    sidebars.openEdit({
      features: clonedFeatures,
      mode: clonedFeatures.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single
    });
  }

  async copyObjects(): Promise<void> {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const layers = await this.getSuitableLayers(this.layer, currentProject.vectorLayers);
    if (this.isSuitableLayersExist(layers)) {
      this.openEditDialog('Копирование', layers)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((selectedLayer: CrgLayer) => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchInsertFeatures(selectedLayer, batchModel);
        });
    }
  }

  async moveObjects(): Promise<void> {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const layers = await this.getSuitableLayers(this.layer, currentProject.vectorLayers);
    if (this.isSuitableLayersExist(layers)) {
      this.openEditDialog('Перемещение', layers)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((selectedLayer: CrgLayer) => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchReplaceFeatures(selectedLayer, batchModel);
        });
    }
  }

  deleteObjects(): void {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const data: ConfirmDialogData = {
      title: 'Удалить выделенные объекты?',
      approveBtnName: 'Удалить'
    };

    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data: data })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(() => {
        const batchModel = this.prepareBatchProcess(selected);
        this.batchDeleteFeatures(batchModel);
        this.attributeTable.selected = [];
      });
  }

  private async checkPermissions() {
    const { dataset, tableName, schemaId } = this.layer;

    this.updatingAllowed = await isFeaturesUpdateAllowed(dataset, tableName, schemaId);
    this.deletingAllowed = await isFeaturesDeleteAllowed(dataset, tableName, schemaId);
  }

  private checkSelectionEmptiness(selected: unknown[]) {
    if (!selected.length) {
      Toast.warn('Нет выделенных объектов');

      return true;
    }

    return false;
  }

  private async getSuitableLayers(currentLayer: CrgLayer, layers: CrgLayer[]): Promise<CrgLayer[]> {
    const schemas = await Promise.all(layers.map(({ schemaId }) => schemaService.getSchema(schemaId)));
    const currentSchema = await schemaService.getSchema(currentLayer.schemaId);
    const layersUpdatePermissions = await Promise.all(
      layers.map(({ dataset, tableName, schemaId }) => isFeaturesUpdateAllowed(dataset, tableName, schemaId))
    );

    return layers.filter((layer, i) => {
      if (!schemas[i]) {
        return false;
      }

      const { geometryType } = schemas[i];

      return (
        currentLayer.complexName !== layer.complexName &&
        currentSchema.geometryType === geometryType &&
        layersUpdatePermissions[i]
      );
    });
  }

  private openEditDialog(title: string, layers: CrgLayer[]): Observable<CrgLayer> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.dialog
      .open(CopyFeaturesDialogComponent, {
        data: {
          title,
          layers,
          objects: this.attributeTable.selected
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
        concatMap(features => transformFeature.insertFeatures(features, selectedLayer.tableName, this.layer.nativeCRS)),
        catchError(err => this.handleError(err))
      )
      .subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;
          Toast.info('Объекты скопированы');
          this.attributeTable.selected = [];
          void this.updateTable(this.requestModel$.getValue());
          mapService.clearDraft();
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
          // eslint-disable-next-line etc/no-deprecated
          return combineLatest(
            of(features),
            transformFeature.insertFeatures(features, selectedLayer.tableName, this.layer.nativeCRS)
          );
        }),
        concatMap(([features]) => {
          const featureIds = features.map(feature => feature.id);

          return transformFeature.deleteFeatures(featureIds, this.layer.tableName);
        }),
        catchError(err => this.handleError(err)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;
          Toast.info('Объекты перемещены');

          void this.updateTable(this.requestModel$.getValue());
        } else {
          this.loadPercent = percent > 100 ? 100 : percent;
        }
      });
  }

  private batchDeleteFeatures(batchModel: BatchModel<WfsFeature>) {
    let i = 0;
    from(batchModel.batches)
      .pipe(
        // eslint-disable-next-line sonarjs/no-identical-functions
        concatMap(features => {
          const featureIds = features.map(feature => feature.id);

          return transformFeature.deleteFeatures(featureIds, this.layer.tableName);
        })
      )
      .subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;

          Toast.info('Объекты удалены');
          mapService.clearDraft();
          mapService.refreshLayers();

          void this.updateTable(this.requestModel$.getValue());
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

  private async prepareColumns(wfsFeature: WfsFeature) {
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
        headerTemplate: this.filterTemplate
        // summaryTemplate: this.headerFilterTemplate
      }
    ];

    if (wfsFeature) {
      const schema = await schemaService.getSchema(this.layer.schemaId);

      Object.keys(wfsFeature.properties).forEach(propertyName => {
        const pSchema = schema.properties.find(propertySchema => propertySchema.name === propertyName);
        if (pSchema && pSchema.valueType === ValueType.LOOKUP) {
          return;
        }

        if (propertyName !== 'bbox') {
          const newProperty: TableColumn = {
            name: this.defineColumnName(propertyName),
            prop: this.definePropertySource(propertyName),
            headerTemplate: this.filterTemplate
          };

          if (propertyName.toLowerCase() === 'globalid') {
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

  private fillAliases(properties: Record<string, unknown>): Record<string, unknown> {
    const resultObject: Record<string, unknown> = {};

    // eslint-disable-next-line sonarjs/cognitive-complexity
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
          if (properties[property]) {
            resultObject[property] = new Date(String(properties[property])).toLocaleDateString();
          }
        } else if (properties[property]) {
          resultObject[property] = moment(properties[property]).locale('ru').format(simpleProperty.dateFormat);
        }
      } else {
        resultObject[property] = properties[property];
      }
    });

    return resultObject;
  }

  private getValueTitle(startValue: string | unknown, enumerations: PropertyEnumerations): string {
    return enumerations.reduce((acc, { value, title }) => {
      return String(startValue) === String(value) ? title : acc;
    }, String(startValue));
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
    if (suitableLayers.length > 0) {
      return true;
    }

    Toast.warn('Нет подходящих слоев');

    return false;
  }
}
