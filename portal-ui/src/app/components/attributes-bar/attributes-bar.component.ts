import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { MatDialog } from '@angular/material/dialog';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, takeUntil } from 'rxjs/operators';

import { Toast } from '../Toast/Toast';
import { schemaService } from '../../services/crg/schema.service';
import { BatchModel } from '../../services/crg/batch-model';
import { CrgLayer } from '../../services/crg/projects.models';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { getFeatures } from '../../services/geoserver/wfs.service';
import { projectsService } from '../../services/crg/projects.service';
import { communicationService } from '../../services/communication.service';
import { mapService } from '../../services/map/map.service';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { RequestAttribute, FilterEvent, Pageable, Sortable } from '../../services/models';
import { WfsFeature, WfsFeatureCollection } from '../../services/geoserver/wfs.models';
import { OldFeatureDescription, ValueType, OldPropertySchema } from '../../services/crg/schemaOld.models';
import { isFeaturesUpdateAllowed, isFeaturesDeleteAllowed } from '../../services/crg/permissions.service';
import { CopyFeaturesDialogComponent } from '../dialogs/copy-features-dialog/copy-features-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { currentProject } from '../../stores/CurrentProject.store';
import { getProjection } from '../../services/geoserver/projections.service';
import { fromMobx } from '../../services/util/fromMobx';
import { generateFilter } from '../../services/geoserver/wfs.util';
import { exportAsCSV } from '../../services/util/export';
import { services } from '../../services/services';

const BATCH_SIZE = 500;

interface DocumentAttachment {
  id: string;
  title: string;
}

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

  lastRequestAttribute: RequestAttribute;

  private schema: OldFeatureDescription;
  private requestAttribute$: BehaviorSubject<RequestAttribute> = new BehaviorSubject<RequestAttribute>({});
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
          this.requestAttribute$.next({ page: { pageSize: 25, offset: 0 } });

          this.attributeTable.selected = [];
          mapService.clearDraft();
          await this.updateTable({ page: { pageSize: 25, offset: 0 } });
          await this.checkPermissions();
        }
      });
  }

  async ngAfterViewInit() {
    await projectsService.fetchCurrent();

    this.requestAttribute$
      .pipe(debounceTime(50), takeUntil(this.unsubscribe$))
      .subscribe((attribute: RequestAttribute) => {
        void this.updateTable(attribute);
      });

    communicationService.featuresUpdated.on(async () => {
      // TODO: Самый простой вариант с лишним запросом. Заменить на обновление данных без запроса.
      const lastRequest = this.requestAttribute$.getValue();
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

  async updateTable(requestAttribute?: RequestAttribute): Promise<void> {
    this.loading = true;
    this.showPercent = false;

    this.lastRequestAttribute = requestAttribute;
    const fCollection: WfsFeatureCollection = await getFeatures(
      this.layer.complexName,
      this.layer.nativeCRS,
      requestAttribute
    );

    if (fCollection) {
      currentProject.updateAttributeTableFilter({
        layerComplexName: this.layer.complexName,
        filter: generateFilter(requestAttribute)
      });

      this.loading = false;
      this.totalFeatures = fCollection.totalFeatures;

      if (this.isNeedPrepareColumn) {
        // TODO: новый запрос в пределах того же слоя не принесет новых колонок! Формировать колонки только
        //  при открытии или при переходе на новый слой
        this.isNeedPrepareColumn = false;
        await this.prepareColumns(fCollection.features[0]);
      }

      this.features = fCollection.features.map((feature: WfsFeature) => {
        const wfsFeatureView: WfsFeatureView = feature;
        wfsFeatureView.aliases = schemaService.replaceRowDataToAliases(this.schema, feature.properties);

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

    const oldRequest = this.requestAttribute$.getValue();
    oldRequest.page = pageInfo;

    this.requestAttribute$.next(oldRequest);
  }

  onSort(sortInfo: Sortable): void {
    const oldRequest = this.requestAttribute$.getValue();
    oldRequest.page.offset = 0;
    oldRequest.sort = sortInfo;

    this.requestAttribute$.next(oldRequest);
  }

  switchFilter(): void {
    this.enableFilter = !this.enableFilter;

    if (!this.enableFilter) {
      const oldRequest = this.requestAttribute$.getValue();
      oldRequest.page.offset = 0;
      oldRequest.filter = [];

      this.requestAttribute$.next(oldRequest);
    }

    // костыль для того, чтобы заставить datatable пересчитать свои размеры
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  async exportAll(): Promise<void> {
    this.loading = true;
    await this.exportLayerAsCSV(this.layer);
    this.loading = false;
  }

  async exportSelected(): Promise<void> {
    this.loading = true;
    await this.exportFeaturesAsCSV(this.layer.schemaId, this.attributeTable.selected);
    this.loading = false;
  }

  async exportByFilter(): Promise<void> {
    this.loading = true;
    await this.exportLayerAsCSV(this.layer, this.lastRequestAttribute?.filter);
    this.loading = false;
  }

  getSchemaProperty(name: string): OldPropertySchema | undefined {
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
    const oldRequest = this.requestAttribute$.getValue();
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

    this.requestAttribute$.next(oldRequest);
  }

  onActivate(event: { type: string; row: WfsFeature }): void {
    if (event.type === 'dblclick') {
      const feature: WfsFeature = event.row;
      if (feature.geometry) {
        this.currentPositionFeature = feature;
        const projection = getProjection(this.layer.nativeCRS);
        mapService.highlightFeatures([feature], projection);
        mapService.positionToFeature(feature, projection);
        this.editFeatures([feature]);
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
      const currentRequestAttribute = this.requestAttribute$.getValue();
      const clonedRequestAttribute: RequestAttribute = cloneDeep(currentRequestAttribute);
      clonedRequestAttribute.page = undefined;

      this.loading = true;
      this.showPercent = false;
      const fCollection: WfsFeatureCollection = await getFeatures(
        this.layer.complexName,
        this.layer.nativeCRS,
        clonedRequestAttribute
      );
      this.attributeTable.selected = fCollection.features;
      this.loading = false;

      this.showSelectedFeatures();
    } else {
      this.attributeTable.selected = [];
      mapService.clearDraft();
    }
  }

  editFeatures(selected: WfsFeature[] = this.attributeTable.selected as WfsFeature[]): void {
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    // В таблице выводился нормальный id без префикса фичи. Теперь верну эту инфу назад.
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
    if (layers.length > 0) {
      this.openEditDialog('Копирование', layers)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((selectedLayer: CrgLayer) => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchInsertFeatures(selectedLayer, batchModel);
        });
    } else {
      Toast.warn('Нет подходящих слоев');
    }
  }

  async moveObjects(): Promise<void> {
    const { selected } = this.attributeTable;
    if (this.checkSelectionEmptiness(selected)) {
      return;
    }

    const layers = await this.getSuitableLayers(this.layer, currentProject.vectorLayers);
    if (layers) {
      this.openEditDialog('Перемещение', layers)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((selectedLayer: CrgLayer) => {
          const batchModel = this.prepareBatchProcess(selected);
          this.batchReplaceFeatures(selectedLayer, batchModel);
        });
    } else {
      Toast.warn('Нет подходящих слоев');
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

  isNotFiltered(): boolean {
    if (!this.enableFilter) {
      return true;
    }

    return this.lastRequestAttribute?.filter?.length ? !this.attributeTable.count : true;
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
          void this.updateTable(this.requestAttribute$.getValue());
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

          void this.updateTable(this.requestAttribute$.getValue());
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

          void this.updateTable(this.requestAttribute$.getValue());
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
    this.columns = [];
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
        name: 'Идентификатор',
        prop: 'id',
        sortable: false,
        resizeable: false,
        width: 110,
        maxWidth: 110,
        headerTemplate: this.filterTemplate
        // summaryTemplate: this.headerFilterTemplate
      }
    ];

    if (wfsFeature) {
      const schema = await schemaService.getSchema(this.layer.schemaId);

      Object.keys(wfsFeature.properties).forEach(key => {
        const pSchema = schema.properties.find(propertySchema => propertySchema.name === key);
        if (pSchema && pSchema.valueType === ValueType.LOOKUP) {
          return;
        }

        if (key !== 'bbox') {
          const newProperty: TableColumn = {
            name: this.defineColumnName(key),
            prop: this.definePropertySource(key),
            headerTemplate: this.filterTemplate
          };

          if (key.toLowerCase() === 'globalid') {
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

  private definePropertySource(property: string) {
    return 'aliases.' + property;
  }

  private defineColumnName(property: string) {
    const result = property;
    const simpleProperty = this.getSchemaProperty(property);

    return simpleProperty ? simpleProperty.title : result;
  }

  private async exportLayerAsCSV(layer: CrgLayer, filter?: FilterEvent[]): Promise<void> {
    try {
      const schema = await schemaService.getById(layer.schemaId);

      const allFeatures: WfsFeature[] = await this.fetchPaged(layer, filter);

      exportAsCSV(this.unparseFeatures(schema, allFeatures), `${schema.tableName}.csv`);
    } catch (error) {
      const msg = `Не удалось выполнить экспорт слоя: ${layer.title}`;
      Toast.error(msg);
      services.logger.error(msg, error);
    }
  }

  private async exportFeaturesAsCSV(schemaId: string, features: WfsFeature[]): Promise<void> {
    try {
      const schema = await schemaService.getById(schemaId);

      exportAsCSV(this.unparseFeatures(schema, features), `${schema.tableName}.csv`);
    } catch (error) {
      const msg = 'Не удалось выполнить экспорт объектов';
      Toast.error(msg);
      services.logger.error(msg, error);
    }
  }

  private unparseFeatures(schema: OldFeatureDescription, allFeatures: WfsFeature[]): unknown[][] {
    const header = schema.properties.map(prop => prop.title);
    const body = allFeatures.map(feature => this.unparseFeature(schema, feature));

    return [header, ...body];
  }

  private unparseFeature(schema: OldFeatureDescription, feature: WfsFeature): unknown[] {
    const aliasedFeature = schemaService.replaceRowDataToAliases(schema, feature.properties);

    return schema.properties.map(prop => {
      let value = aliasedFeature[prop.name.toLowerCase()];
      if (value && prop.valueType === ValueType.DOUBLE) {
        value = String(value).replace('.', ',');
      }

      if (prop.name.toLowerCase() === 'documents' && value) {
        const documents = JSON.parse(value as string) as DocumentAttachment[];
        let documentsTitle = '';

        documents.forEach(document => {
          documentsTitle += `${document.title}; `;
        });

        return documentsTitle;
      }

      return value ? value : '';
    });
  }

  private async fetchPaged(layer: CrgLayer, filter?: FilterEvent[]): Promise<WfsFeature[]> {
    const { complexName, nativeCRS } = layer;

    let result: WfsFeature[] = [];
    let totalPages = 0;
    let currentPage = 0;

    do {
      const requestAttribute: RequestAttribute = {
        filter,
        page: {
          pageSize: BATCH_SIZE,
          offset: currentPage
        }
      };

      const response: WfsFeatureCollection = await getFeatures(complexName, nativeCRS, requestAttribute);
      if (response.features) {
        totalPages = Math.ceil(response.totalFeatures / BATCH_SIZE);
        if (response.features.length) {
          result = [...result, ...response.features];
        }
      }

      currentPage++;
    } while (currentPage < totalPages);

    return result;
  }
}
