import * as _ from 'lodash';
import {BehaviorSubject, from, Observable, of, Subject} from 'rxjs';
import {DatatableComponent, TableColumn} from '@swimlane/ngx-datatable';
import {concatMap, debounceTime, filter, flatMap, map, takeUntil} from 'rxjs/operators';
import {CrgLayer, LayersService} from '../../services/geoserver/layers.service';
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
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {DataSchemaService, SimpleProperty} from '../../services/crg/data-schema.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {FilterEvent, Pageable, RequestModel, Sortable} from '../../services/models/requestModel';
import {WfsFeature, WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FizLogger} from '../../services/logger/fiz.logger';
import {ProjectsService} from '../../services/crg/projects.service';
import {EditFeatureMode} from '../edit-feature/edit-feature.component';
import {ValueTitleProjection} from '../../services/geoserver/projections';
import {AttributeTableViewSettings, ViewMode} from './attribute.settings';
import {ViewFeaturesData} from '../view-features/view-features.component';
import {CommunicationService} from '../../services/communication.service';
import {ProjectModel} from '../../services/geoserver/import/projectModel';
import {TransformFeatureService} from '../../services/geoserver/transform-feature.service';
import {CopyFeaturesDialogComponent} from '../dialogs/copy-features-dialog/copy-features-dialog.component';
import {ConfirmDialogComponent, ConfirmDialogData} from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() layer: CrgLayer;

  @ViewChild(DatatableComponent) attributeTable: DatatableComponent;
  @ViewChild('filterTemplate') filterTemplate: TemplateRef<any>;
  @ViewChild('cellTemplate') cellTemplate: TemplateRef<any>;
  @ViewChild('customSelectAll') customSelectAll: TemplateRef<any>;

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

  private requestModel$: BehaviorSubject<RequestModel> = new BehaviorSubject<RequestModel>({});
  private unsubscribe$: Subject<void> = new Subject<void>();
  private projectModel: ProjectModel;

  private BATCH_SIZE = 200;

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private tFeatureService: TransformFeatureService,
              private projectsService: ProjectsService,
              private layersService: LayersService,
              private rulesService: DataSchemaService,
              private communicationService: CommunicationService,
              private snackBar: MatSnackBar,
              private log: FizLogger,
              private dialog: MatDialog,
              private openLayersService: OpenLayersService) { }

  ngAfterViewInit(): void {
    this.projectModel = this.projectsService.getCurrent();

    this.requestModel$
        .pipe(
          debounceTime(50),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((requestModel: RequestModel) => {
          this.updateTable(requestModel);
        });

    this.communicationService.featuresUpdate$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          // TODO: Самы простой вариант с лишним запросом. Заменить на обновление данных без запроса.
          const lastRequest = this.requestModel$.getValue();
          this.updateTable(lastRequest);
        });

    this.communicationService.selectedFeatures$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((features: WfsFeature[]) => {
          // this.attributeTable.selected = features;
        });

  }

  ngOnChanges(changes: SimpleChanges): void {
    const layerChanged = changes['layer'];
    if (layerChanged && !layerChanged.isFirstChange()) {
      this.isNeedPrepareColumn = true;
      this.requestModel$.next({page: {pageSize: 25, offset: 0}});

      this.attributeTable.selected = [];
      this.openLayersService.clearDraft();
      this.updateTable({page: {pageSize: 25, offset: 0}});
    }
  }

  ngOnDestroy(): void {
    this.openLayersService.clearDraft();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateTable(requestModel?: RequestModel) {
    this.loading = true;
    this.showPercent = false;
    this.wfsService.getFeatures(this.layer.complexName, requestModel)
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
            this.log.warn('attributes table', 'Unexpected response:', fCollection);
          }
        });
  }

  showSelectedFeatures() {
    // Очищаем предыдущие
    this.openLayersService.clearDraft();

    // Подсвечиваем выделенные если есть
    if (this.attributeTable.selected.length > 0) {
      this.attributeTable.selected.forEach((feature: WfsFeature) => this.openLayersService.paintFeature(feature));
    }
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
  }

  getSimpleProperty(name: string): SimpleProperty | undefined {
    if (!name) {
      return;
    }

    return this.rulesService
               .getFeatureDescriptionByName(this.layer.name).properties
               .find((property: SimpleProperty) => property.name.toLowerCase() === name.toLowerCase());
  }

  closeMe() {
    this.openLayersService.clearDraft();
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
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

      this.openLayersService.showFeature(event.row);
    }
  }

  handleSelectAll() {
    if (this.features.length === 0) {
      return;
    }

    this.isSelectAll = !this.isSelectAll;
    if (this.isSelectAll) {
      const currentRequestModel = this.requestModel$.getValue();
      const clonedRequestModel: RequestModel = _.cloneDeep(currentRequestModel);
      clonedRequestModel.page = undefined;

      this.loading = true;
      this.showPercent = false;
      this.wfsService.getFeatures(this.layer.complexName, clonedRequestModel)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(fCollection => {
            this.attributeTable.selected = fCollection.features;
            this.loading = false;

            this.showSelectedFeatures();
          });
    } else {
      this.attributeTable.selected = [];
      this.openLayersService.clearDraft();
    }
  }

  editFeatures() {
    const selectedFeatures = this.attributeTable.selected;
    if (selectedFeatures.length < 1) {
      this.snackBar.open('Нет выделенных обьектов', 'X', {duration: 3000});
      return;
    }

    // В таблице выводился нормальный id без перфикса фичи. Теперь верну эту инфу назад.
    const clonedFeatures: WfsFeature[] = JSON.parse(JSON.stringify(selectedFeatures));
    clonedFeatures.forEach((feature: WfsFeature) => {
      feature.id = this.layer.name + '.' + feature.id;
    });

    // Отсылка в сайдбар
    this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.OPEN,
      data: {
        features: clonedFeatures,
        mode: clonedFeatures.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single
      } as ViewFeaturesData
    });
  }

  copyObjects() {
    this.prepareSuitableLayers()
        .pipe(
          filter(value => this.checkIsLayersExist(value)),
          flatMap((suitableLayers: CrgLayer[]) => this.openEditDialog('Копирование', suitableLayers)),
          takeUntil(this.unsubscribe$)
        ).subscribe((selectedLayer: CrgLayer) => {
          this.batchInsertFeatures(selectedLayer);
        });
  }

  moveObjects() {
    this.prepareSuitableLayers()
        .pipe(
          filter(value => this.checkIsLayersExist(value)),
          flatMap(suitableLayers => this.openEditDialog('Перемещение', suitableLayers)),
          flatMap(selectedLayer => this.makeInsert(selectedLayer)),
          flatMap(() => this.makeDelete()),
          takeUntil(this.unsubscribe$)
        ).subscribe((result) => {
          if (result.includes('<wfs:totalDeleted>' + this.attributeTable.selected.length + '</wfs:totalDeleted>')) {
            this.updateTable(this.requestModel$.getValue());

            this.snackBar.open('Обьекты перемещены', 'X', {duration: 3000});
          } else {
            this.snackBar.open('Не удалось переместить', 'X', {duration: 6000});
          }
        });
  }

  deleteObjects() {
    if (this.attributeTable.selected.length < 1) {
      this.snackBar.open('Нет выделенных обьектов', 'X', {duration: 3000});
      return;
    }

    const data: ConfirmDialogData = {
      title: 'Удалить выделенные обьекты?',
      approveBtnName: 'Удалить'
    };

    this.dialog
      .open(ConfirmDialogComponent, {width: '400px', data: data})
      .afterClosed().pipe(filter(value => !!value))
      .subscribe(() => {
        const workspaceName = this.projectModel.crgProject.workspaceName;
        this.tFeatureService
          .deleteFeatures(this.attributeTable.selected, workspaceName, this.layer.name)
          .subscribe(() => {
            const lastRequest = this.requestModel$.getValue();
            this.updateTable(lastRequest);
          });
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
               .afterClosed();
  }

  private makeInsert(selectedLayer: CrgLayer): Observable<string> {
    const workspaceName = this.projectModel.crgProject.workspaceName;

    return this.tFeatureService
               .insertFeatures(this.attributeTable.selected, workspaceName, selectedLayer.name);
  }

  private batchInsertFeatures(selectedLayer: CrgLayer) {
    this.showPercent = true;
    const workspaceName = this.projectModel.crgProject.workspaceName;
    const selectedFeatures = this.attributeTable.selected;

    this.loading = true;
    if (selectedFeatures.length > this.BATCH_SIZE) {
      const countOfParts = Math.ceil(selectedFeatures.length / this.BATCH_SIZE);
      const onePartOf100 = 100 / countOfParts;

      const result = this.tFeatureService.splitListToParts(selectedFeatures, countOfParts);

      let i = 0;
      from(result)
        .pipe(
          concatMap(features => this.tFeatureService.insertFeatures(features, workspaceName, selectedLayer.name)),
        ).subscribe(value => {
        i++;
        const percent = Math.ceil(onePartOf100 * i);
        if (i >= countOfParts) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.loading = false;
          this.snackBar.open('Обьекты скопированы', 'X', {duration: 3000});
        } else {
          this.loadPercent = percent > 100 ? 100 : percent;
        }
      });
    } else {
      this.tFeatureService
          .insertFeatures(selectedFeatures, workspaceName, selectedLayer.name)
          .subscribe(response => {
            this.loadPercent = 100;
            if (response.includes('<wfs:totalInserted>' + selectedFeatures.length + '</wfs:totalInserted>')) {
              this.loading = false;
              this.snackBar.open('Обьекты скопированы', 'X', {duration: 3000});
            } else {
              this.loading = false;
              this.log.warn('attributes table', 'InsertFeature response: ', response);
              this.snackBar.open('Не удалось сохранить', 'X', {duration: 6000});
            }
          });
    }
  }

  private makeDelete(): Observable<string> {
    const workspaceName = this.projectModel.crgProject.workspaceName;

    return this.tFeatureService
               .deleteFeatures(this.attributeTable.selected, workspaceName, this.layer.name);
  }

  private prepareSuitableLayers() {
    if (this.attributeTable.selected.length < 1) {
      this.snackBar.open('Нет выделенных обьектов', 'X', {duration: 3000});
      return of([]);
    }

    return this.layersService.layers$
               .pipe(
                 map((layers: CrgLayer[]) => this.rulesService.getSuitableByGeometryLayers(this.layer, layers))
               );
  }

  // onViewModeChange(event: MatSelectChange) {
  //   if (this.viewSettings.viewMode === ViewMode.alias) {
  //     // Название столбца
  //     this.attributeTable.columns.forEach(column => {
  //       const property = column.prop.toString();
  //       if (property === 'id') {
  //         column.name = 'Идентификатор';
  //       } else {
  //         const simpleProperty = this.getSimpleProperty(property.split('.')[1]);
  //         if (simpleProperty) {
  //           column.name = simpleProperty.title;
  //         }
  //       }
  //     });
  //
  //     // Данные
  //     const features: WfsFeatureView[] = this.attributeTable.rows;
  //     features.forEach((feature: WfsFeatureView) => {
  //       feature.updated = Date.now().toString();
  //
  //       Object.keys(feature.properties).forEach(prop => {
  //         const simpleProperty = this.getSimpleProperty(prop);
  //         if (simpleProperty && simpleProperty.valueType === 'CHOICE') {
  //           const valueTitle = this.getValueTitle(feature.properties[prop], simpleProperty.enumerations);
  //           if (valueTitle) {
  //             feature.aliases[prop] = valueTitle;
  //           } else {
  //             feature.aliases[prop] = '';
  //           }
  //         }
  //       });
  //     });
  //
  //     this.features = [...features];
  //   } else {
  //     // Название столбца
  //     this.attributeTable.columns.forEach(column => {
  //       const property = column.prop.toString();
  //       if (property === 'id') {
  //         column.name = 'id';
  //       } else {
  //         column.name = property.split('.')[1];
  //       }
  //     });
  //
  //     // Данные
  //     const features: WfsFeatureView[] = this.attributeTable.rows;
  //     features.forEach((feature: WfsFeatureView) => {
  //       feature.updated = Date.now().toString();
  //
  //       Object.keys(feature.properties).forEach(prop => {
  //         const simpleProperty = this.getSimpleProperty(prop);
  //         if (simpleProperty && simpleProperty.valueType === 'CHOICE') {
  //           feature.aliases[prop] = feature.properties[prop];
  //         }
  //       });
  //     });
  //
  //     this.features = [...features];
  //   }
  // }

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

  private fillAliases(properties: {}): {} {
    const resultObject = {};

    Object.keys(properties).forEach(property => {
      const simpleProperty = this.getSimpleProperty(property);
      if (simpleProperty && simpleProperty.valueType === 'CHOICE') {
        if (this.viewSettings.viewMode === ViewMode.internal) {
          resultObject[property] = properties[property];
        } else {
          const valueTitle = this.getValueTitle(properties[property], simpleProperty.enumerations);
          if (valueTitle) {
            resultObject[property] = valueTitle;
          }
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

  private checkIsLayersExist(value) {
    if (!!value.length) {
      return true;
    } else {
      this.snackBar.open('Нет подходящих слоев', 'X', {duration: 6000});
      return false;
    }
  }
}

export interface WfsFeatureView extends WfsFeature {
  aliases?: {};
  updated?: string;
}
