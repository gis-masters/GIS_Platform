import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest} from 'rxjs';
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

  isNeedPrepareColumn = true;

  features: WfsFeature[] = [];
  totalFeatures: number;
  columns: TableColumn[] = [];
  customRowIdentity = ((row: WfsFeature) => row.id);
  pageInfo: Pageable = {
    pageSize: 20,
    offset: 0
  };

  enableFilter = false;
  loading = true;

  // TODO: отписаться
  private requestModel$: BehaviorSubject<RequestModel> = new BehaviorSubject<RequestModel>({});

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private log: FizLogger,
              private openLayersService: OpenLayersService) { }

  ngAfterViewInit(): void {
    this.requestModel$
        .pipe(
          tap(console.log),
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

            if (this.isNeedPrepareColumn) {
              this.prepareColumns(fCollection.features[0]);
              this.isNeedPrepareColumn = false;
            }

            this.features = fCollection.features.map((feature: WfsFeature) => {
              // TODO: возможно стоит вынести непосредственно в сервис
              feature.id = feature.id.split('.')[1];

              return feature;
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

  getProperty(name: string): SimpleProperty {
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

  private prepareColumns(wfsFeature: WfsFeature) {
    this.columns = [
      {
        name: 'ID',
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
            name: property,
            prop: 'properties.' + property,
            headerTemplate: this.filterTemplate,
          };

          if (property.toLowerCase() === 'globalid') {
            newProperty.width = 300;
            newProperty.resizeable = false;
          }

          if (property.toLowerCase() === 'classid') {
            newProperty.width = 80;
            newProperty.resizeable = false;
          }

          this.columns.push(newProperty);
        }
      });
    } else {
      console.warn('No wfsFeature');
    }

  }

  onFilterChange(filterEvent: FilterEvent) {
    const oldRequest = this.requestModel$.getValue();
    oldRequest.page.offset = 0;

    const oldFilter = oldRequest.filter;

    if (oldFilter) {
      let isNotExist = true;
      oldFilter.forEach((oldFilterEvent: FilterEvent) => {
        if (oldFilterEvent && oldFilterEvent.property && oldFilterEvent.property.name === filterEvent.property.name) {
          oldFilterEvent.value = filterEvent.value;
          isNotExist = false;
        }
      });

      if (isNotExist) {
        oldFilter.push(filterEvent);
      }
    } else {
      oldRequest.filter = [filterEvent];
    }

    this.requestModel$.next(oldRequest);
  }
}
