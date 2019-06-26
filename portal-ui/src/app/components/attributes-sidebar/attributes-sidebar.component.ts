import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {WfsFeature, WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';
import {TableColumn} from '@swimlane/ngx-datatable';
import {Pageable, RequestModel, Sortable} from '../../services/models/requestModel';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() layer: CrgLayer;

  @ViewChild('attributeFilter') filterInput: ElementRef;

  features: WfsFeature[] = [];
  selectedFeatures: WfsFeature[] = [];
  totalFeatures: number;

  columns: TableColumn[] = [];

  loading = true;

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
        map(([page, sort, filter]) => {
          // console.log('RequestModel: ', page, sort, filter);

          return {
            page: page[0],
            sort: sort[0],
            filter: filter[0]
          } as RequestModel;
        }),
        // distinctUntilChanged(), // If previous query is different from current
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

            console.log('fCollection: ', fCollection);

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
    this.pageEvent$.next([pageInfo]);
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
      }
    ];

    Object.keys(wfsFeature.properties).forEach(property => {
      if (property !== 'bbox') {
        const newProperty: TableColumn = {
          name: property,
          prop: 'properties.' + property,
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
  }

}
