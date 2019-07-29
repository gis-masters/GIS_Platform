import * as _ from 'lodash';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';
import {CrgLayer, LayersService} from '../../services/geoserver/layers.service';
import {DatatableComponent, TableColumn} from '@swimlane/ngx-datatable';
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
import {FilterEvent, Pageable, RequestModel, Sortable} from '../../services/models/requestModel';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {WfsFeature, WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';
import {FgistpRulesService, SimpleProperty} from '../../services/crg/fgistp-rules.service';
import {FizLogger} from '../../services/logger/fiz.logger';
import {MatDialog, MatSelectChange, MatSnackBar} from '@angular/material';
import {ValueTitleProjection} from '../../services/geoserver/projections';
import {AttributeTableViewSettings, ViewMode} from './attribute.settings';
import {ViewFeaturesData} from '../view-features/view-features.component';
import {EditFeatureData, EditFeatureMode} from '../edit-feature/edit-feature.component';
import {CommunicationService} from '../../services/communication.service';
import {
  CopyFeaturesDialogComponent,
  CopyFeaturesDialogData
} from '../dialogs/copy-features-dialog/copy-features-dialog.component';

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

  private requestModel$: BehaviorSubject<RequestModel> = new BehaviorSubject<RequestModel>({});
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private layersService: LayersService,
              private fgistpRulesService: FgistpRulesService,
              private communicationService: CommunicationService,
              private snackBar: MatSnackBar,
              private log: FizLogger,
              private dialog: MatDialog,
              private openLayersService: OpenLayersService) { }

  ngAfterViewInit(): void {
    this.requestModel$
        .pipe(
          debounceTime(50),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((requestModel: RequestModel) => {
          this.loadFeatures(requestModel);
        });

    this.communicationService.featuresUpdate$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((editFeatureData: EditFeatureData) => {
          // TODO: Самы простой вариант с лишним запросом. Заменить на обновление данных без запроса.
          const lastRequest = this.requestModel$.getValue();
          this.loadFeatures(lastRequest);
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const layerChanged = changes['layer'];
    if (layerChanged && !layerChanged.isFirstChange()) {
      this.isNeedPrepareColumn = true;
      this.requestModel$.next({page: {pageSize: 25, offset: 0}});

      this.attributeTable.selected = [];
      this.openLayersService.clearDraft();
      this.loadFeatures({page: {pageSize: 25, offset: 0}});
    }
  }

  ngOnDestroy(): void {
    this.openLayersService.clearDraft();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadFeatures(requestModel?: RequestModel) {
    this.loading = true;
    this.wfsService.getFeatures(this.layer.complexName, requestModel)
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

  onSelect({selected}) {
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

    return this.fgistpRulesService
               .getFeatureByName(this.layer.name, 'attributes sidebar').properties
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

  editFeatures() {
    // При сервер сайд паджинации галочка выделить все - НЕ выделит всё.
    // Обработаем эту ситуацию: выгребем ВСЕ данные из API по текущему фильтру убрав паджинацию
    if (this.attributeTable.allRowsSelected) {
      const requestModel = this.requestModel$.getValue();
      // Если нажали выделить все и эти все помещаются в одну страницу то доп. запрос не нужен
      if (this.attributeTable.selected.length < requestModel.page.pageSize) {
        this.sendSelectedFeaturesToEdit(this.attributeTable.selected);
        return;
      }

      const currentRequestModel = this.requestModel$.getValue();
      const clonedRequestModel: RequestModel = _.cloneDeep(currentRequestModel);

      clonedRequestModel.page = undefined;

      this.loading = true;
      this.wfsService.getFeatures(this.layer.complexName, clonedRequestModel)
        .subscribe((fCollection: WfsFeatureCollection) => {
          if (fCollection) {
            this.loading = false;

            this.sendSelectedFeaturesToEdit(fCollection.features);
          }
        });
    } else {
      this.sendSelectedFeaturesToEdit(this.attributeTable.selected);
    }
  }

  copyObjects() {
    if (!this.attributeTable.allRowsSelected) {
      if (this.attributeTable.selected.length < 1) {
        this.snackBar.open('Нет выделенных обьектов', 'X', {duration: 3000});
        return;
      }

      let layers: CrgLayer[];
      this.layersService.layers$
          .subscribe((data: CrgLayer[]) => layers = data);

      // Все слоя кроме текущего
      _.remove(layers, (layer: CrgLayer) => layer.complexName === this.layer.complexName);

      const dialogData: CopyFeaturesDialogData = {
        layers: layers,
        objects: this.attributeTable.selected,
      };

      this.dialog
          .open(CopyFeaturesDialogComponent, {data: dialogData})
          .afterClosed().subscribe((selectedLayer: CrgLayer) => {
            if (!!selectedLayer) {
              console.log('Dialog result: ', selectedLayer.title);
            } else {
              this.log.warn('attributes table', 'Incorrect response from dialog', selectedLayer);
            }
          });
    } else {
      this.log.warn('attributes table', 'not supported');
    }
  }

  onViewModeChange(event: MatSelectChange) {
    if (this.viewSettings.viewMode === ViewMode.alias) {
      // Название столбца
      this.attributeTable.columns.forEach(column => {
        const property = column.prop.toString();
        if (property === 'id') {
          column.name = 'Идентификатор';
        } else {
          const simpleProperty = this.getSimpleProperty(property.split('.')[1]);
          if (simpleProperty) {
            column.name = simpleProperty.title;
          }
        }
      });

      // Данные
      const features: WfsFeatureView[] = this.attributeTable.rows;
      features.forEach((feature: WfsFeatureView) => {
        feature.updated = Date.now().toString();

        Object.keys(feature.properties).forEach(prop => {
          const simpleProperty = this.getSimpleProperty(prop);
          if (simpleProperty && simpleProperty.valueType === 'CHOICE') {
            const valueTitle = this.getValueTitle(feature.properties[prop], simpleProperty.enumerations);
            if (valueTitle) {
              feature.aliases[prop] = valueTitle;
            } else {
              feature.aliases[prop] = '';
            }
          }
        });
      });

      this.features = [...features];
    } else {
      // Название столбца
      this.attributeTable.columns.forEach(column => {
        const property = column.prop.toString();
        if (property === 'id') {
          column.name = 'id';
        } else {
          column.name = property.split('.')[1];
        }
      });

      // Данные
      const features: WfsFeatureView[] = this.attributeTable.rows;
      features.forEach((feature: WfsFeatureView) => {
        feature.updated = Date.now().toString();

        Object.keys(feature.properties).forEach(prop => {
          const simpleProperty = this.getSimpleProperty(prop);
          if (simpleProperty && simpleProperty.valueType === 'CHOICE') {
            feature.aliases[prop] = feature.properties[prop];
          }
        });
      });

      this.features = [...features];
    }
  }

  private prepareColumns(wfsFeature: WfsFeature) {
    this.columns = [
      {
        name: '',
        prop: '',
        sortable: false,
        resizeable: false,
        width: 12,
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
        headerCheckboxable: true,
        checkboxable: true
      },
      {
        name: this.viewSettings.viewMode === ViewMode.internal ? 'ID' : 'Идентификатор',
        prop: 'id',
        sortable: false,
        resizeable: false, width: 100,
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

  private sendSelectedFeaturesToEdit(features: WfsFeature[]) {
    if (features.length < 1) {
      this.snackBar.open('Нет выделенных обьектов', 'X', {duration: 3000});
      return;
    }

    // В таблице выводился нормальный id без перфикса фичи. Теперь верну эту инфу назад.
    const clonedFeatures: WfsFeature[] = JSON.parse(JSON.stringify(features));
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

}

export interface WfsFeatureView extends WfsFeature {
  aliases?: {};
  updated?: string;
}
