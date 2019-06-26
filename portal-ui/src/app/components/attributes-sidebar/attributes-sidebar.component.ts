import {fromEvent} from 'rxjs';
import {LazyLoadEvent} from 'primeng/api';
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
import {WfsFeature, WfsFeatureCollection, WfsGeometry, WfsService} from '../../services/geoserver/wfs.service';
import {TableColumn} from '@swimlane/ngx-datatable';

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

  private lastEvent: LazyLoadEvent;

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private openLayersService: OpenLayersService) { }

  ngAfterViewInit(): void {
    // fromEvent(this.filterInput.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: any) => event.target.value),
    //     debounceTime(500),
    //     distinctUntilChanged() // If previous query is different from current
    //   )
    //   .subscribe(value => {
    //     this.lastEvent.globalFilter = value;
    //
    //     this.loadObjectsLazy(this.lastEvent);
    //   });

    this.loadObjectsLazy({rows: 20, first: 0});
  }


  ngOnChanges(changes: SimpleChanges): void {
    const layerChanged = changes['layer'];
    if (layerChanged && !layerChanged.isFirstChange()) {
      this.loadObjectsLazy({rows: 20, first: 0});
    }
  }

  loadObjectsLazy(event: LazyLoadEvent) {
    console.log('this.lastEvent: ', this.lastEvent);

    this.lastEvent = event;
    this.loading = true;
    this.wfsService.getFeatures(this.layer.complexName, event)
        .subscribe((fCollection: WfsFeatureCollection) => {
          if (fCollection) {
            this.loading = false;

            this.totalFeatures = fCollection.totalFeatures;
            this.prepareColumns(fCollection.features[0]);

            this.features = fCollection.features.map((feature: WfsFeature) => {
              // TODO: возможно стоит вынести непосредственно в  сервис
              feature.id = feature.id.split('.')[1];

              return feature;
            });
          }
        });
  }

  handleSelection() {
    // Очищаем предыдущие
    this.openLayersService.clearDraft();

    // Подсвечиваем выделенные если есть
    if (this.selectedFeatures.length > 0) {
      this.selectedFeatures.forEach((feature: WfsFeature) => this.openLayersService.paintFeature(feature));
    }
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

  onSelect({ selected }) {
    this.selectedFeatures.splice(0, this.selectedFeatures.length);
    this.selectedFeatures.push(...selected);

    console.log('Select Event', this.selectedFeatures);
  }

  setPage(event) {
    console.log('--- +++', event);
  }
}
