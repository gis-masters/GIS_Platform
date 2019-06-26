import {debounceTime, map} from 'rxjs/operators';
import {TableColumn} from '@swimlane/ngx-datatable';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {Pageable, RequestModel, Sortable} from '../../services/models/requestModel';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {WfsFeature, WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() layer: CrgLayer;

  @ViewChild('attributeFilter') filterInput: ElementRef;
  @ViewChild('headerFilterTemplate') headerFilterTemplate: TemplateRef<any>;

  pageInfo: Pageable = {
    pageSize: 13,
    offset: 0
  };

  features: WfsFeature[] = [];
  selectedFeatures: WfsFeature[] = [];
  totalFeatures: number;

  columns: TableColumn[] = [];

  loading = false;

  private requestModel: RequestModel;
  // TODO: отписаться от событий при дестрое
  private pageEvent$: BehaviorSubject<Pageable[]> = new BehaviorSubject<Pageable[]>([{}]);
  private sortEvent$: BehaviorSubject<Sortable[]> = new BehaviorSubject<Sortable[]>([{}]);
  private filterEvent$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([{}]);

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private openLayersService: OpenLayersService) { }

  ngAfterViewInit(): void {
    combineLatest(this.pageEvent$.pipe(debounceTime(50)),
                  this.sortEvent$.pipe(debounceTime(50)),
                  this.filterEvent$.pipe(debounceTime(500)))
      .pipe(
        map(([pageInfo, sortInfo, filterInfo]) => {
          // console.log('RequestModel: ', pageInfo, sortInfo, filterInfo);

          return {
            page: pageInfo[0],
            sort: sortInfo[0],
            filter: filterInfo[0]
          } as RequestModel;
        }),
        debounceTime(10)
      )
      .subscribe((requestModel: RequestModel) => {
        this.loadFeatures(requestModel);
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    const layerChanged = changes['layer'];
    if (layerChanged && !layerChanged.isFirstChange()) {
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
            this.prepareColumns(fCollection.features[0]);

            // console.log('fCollection: ', fCollection);

            this.features = fCollection.features.map((feature: WfsFeature) => {
              // TODO: возможно стоит вынести непосредственно в  сервис
              feature.id = feature.id.split('.')[1];

              return feature;
            });
          }
        });
  }

  onSelect({ selected }) {
    this.selectedFeatures.splice(0, this.selectedFeatures.length);
    this.selectedFeatures.push(...selected);

    // Очищаем предыдущие
    this.openLayersService.clearDraft();

    // Подсвечиваем выделенные если есть
    if (this.selectedFeatures.length > 0) {
      this.selectedFeatures.forEach((feature: WfsFeature) => this.openLayersService.paintFeature(feature));
    }
  }

  setPage(pageInfo: Pageable) {
    this.pageInfo = pageInfo;

    this.pageEvent$.next([pageInfo]);
  }

  onSort(sortInfo: Sortable) {
    this.pageInfo.offset = 0;

    this.pageEvent$.next([this.pageInfo]);
    this.sortEvent$.next([sortInfo]);
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
        headerTemplate: this.headerFilterTemplate,
      }
    ];

    if (wfsFeature) {
      Object.keys(wfsFeature.properties).forEach(property => {
        if (property !== 'bbox') {
          const newProperty: TableColumn = {
            name: property,
            prop: 'properties.' + property,
            // headerTemplate: this.headerFilterTemplate
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

}
