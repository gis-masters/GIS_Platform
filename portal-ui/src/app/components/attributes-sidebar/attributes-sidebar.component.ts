import {debounceTime, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {CrgLayer} from '../../services/geoserver/layers.service';
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
import {SimpleProperty, XsdFeature} from '../../services/gis/fgistp-rules.service';
import {FizLogger} from '../../services/logger/fiz.logger';
import {MatSelectChange} from '@angular/material';
import {ValueTitleProjection} from '../../services/geoserver/projections';
import {AttributeTableViewSettings, ViewMode} from './attribute.settings';
import {ViewFeaturesData} from '../view-features/view-features.component';
import {EditFeatureMode} from '../edit-feature/edit-feature.component';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() layer: CrgLayer;
  @Input() featureDescription: XsdFeature;

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
    pageSize: 20,
    offset: 0
  };

  enableFilter = false;
  loading = true;
  viewSettings: AttributeTableViewSettings = {
    viewMode: ViewMode.alias
  };

  // TODO: отписаться
  private requestModel$: BehaviorSubject<RequestModel> = new BehaviorSubject<RequestModel>({});

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private log: FizLogger,
              private openLayersService: OpenLayersService) { }

  ngAfterViewInit(): void {
    this.requestModel$
        .pipe(
          debounceTime(50)
        )
        .subscribe((requestModel: RequestModel) => {
          this.loadFeatures(requestModel);
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const layerChanged = changes['layer'];
    if (layerChanged && !layerChanged.isFirstChange()) {
      this.isNeedPrepareColumn = true;
      this.requestModel$.next({page: {pageSize: 20, offset: 0}});

      this.attributeTable.selected = [];
      this.openLayersService.clearDraft();
      this.loadFeatures();
    }
  }

  loadFeatures(requestModel?: RequestModel) {
    // console.log('loadObjectsLazy: ', requestModel);

    this.loading = true;
    this.wfsService.getFeatures(this.layer.complexName, requestModel)
        .subscribe((fCollection: WfsFeatureCollection) => {
          if (fCollection) {
            this.loading = false;

            this.totalFeatures = fCollection.totalFeatures;

            // console.log('++++++++: ', this.featureDescription);

            if (this.isNeedPrepareColumn) {
              this.prepareColumns(fCollection.features[0]);
              this.isNeedPrepareColumn = false;
            }

            this.features = fCollection.features.map((feature: WfsFeature) => {
              // TODO: возможно стоит вынести непосредственно в сервис
              feature.id = feature.id.split('.')[1];

              const wfsFeatureView: WfsFeatureView = feature;
              wfsFeatureView.aliases = this.fillAliases(feature.properties);

              return wfsFeatureView;
            });
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

    return this.featureDescription.properties
               .find((property: SimpleProperty) => property.name.toLowerCase() === name.toLowerCase());
  }

  closeMe() {
    this.openLayersService.clearDraft();
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  ngOnDestroy(): void {
    this.openLayersService.clearDraft();
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

  private prepareColumns(wfsFeature: WfsFeature) {
    this.columns = [
      {
        name: '',
        prop: '',
        sortable: false,
        resizeable: false,
        width: 20,
        cellTemplate: this.cellTemplate
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
            prop: this.definePropertySourse(property),
            headerTemplate: this.filterTemplate,
          };

          if (property.toLowerCase() === 'globalid') {
            newProperty.width = 300;
            newProperty.resizeable = false;
          }

          // if (property.toLowerCase() === 'classid') {
          //   newProperty.width = 80;
          //   newProperty.resizeable = false;
          // }

          this.columns.push(newProperty);
        }
      });
    } else {
      console.warn('No wfsFeature');
    }

  }

  onActivate(event: any) {
    if (event.type === 'dblclick') {
      this.currentPositionFeature = event.row;

      this.openLayersService.showFeature(event.row);
    }
  }

  onViewModeChange(event: MatSelectChange) {
    this.isNeedPrepareColumn = true;
    this.loadFeatures();
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

  private fillAliases(properties: {}): {} {
    const resultObject = {};

    Object.keys(properties).forEach(property => {
      const simpleProperty = this.getSimpleProperty(property);
      if (simpleProperty && simpleProperty.valueType === 'CHOICE') {
        const valueTitle = this.getValueTitle(properties[property], simpleProperty.enumerations);
        if (valueTitle) {
          resultObject[property] = valueTitle;
        }
      } else {
        resultObject[property] = properties[property];
      }
    });

    return resultObject;
  }

  private definePropertySourse(property: string) {
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

  editFeatures() {
    const clonedFeatures: WfsFeature[] = JSON.parse(JSON.stringify(this.attributeTable.selected));
    clonedFeatures.forEach((feature: WfsFeature) => {
      feature.id = this.layer.name + '.' + feature.id;
    });

    this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.OPEN,
      data: {
        features: clonedFeatures,
        mode: EditFeatureMode.multipleEdit
      } as ViewFeaturesData
    });
  }
}

export interface WfsFeatureView extends WfsFeature {
  aliases?: {};
}
