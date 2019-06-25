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

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() layer: CrgLayer;

  @ViewChild('attributeFilter') filterInput: ElementRef;

  features: AttributeFeature[] = [];
  selectedFeatures: AttributeFeature[] = [];
  totalFeatures: number;

  cols = [];

  loading = true;

  private lastEvent: LazyLoadEvent;

  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King Burger King Burger King Burger King Burger King Burger' +
        ' King Burger King Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

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
            this.fillColsFromFeatureProperties(fCollection.features[0]);

            this.features = fCollection.features.map(feature => this.mapWfsFeatureToAttrFeature(feature));
          }
        });
  }

  handleSelection() {
    // Очищаем предыдущие
    this.openLayersService.clearDraft();

    // Подсвечиваем выделенные если есть
    if (this.selectedFeatures.length > 0) {
      this.selectedFeatures.forEach((feature: AttributeFeature) => {
        const wfsFeature = this.mapAttrFeatureToWfsFeature(feature);

        this.openLayersService.paintFeature(wfsFeature);
      });
    }
  }

  closeMe() {
    this.openLayersService.clearDraft();
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  ngOnDestroy(): void {
    this.openLayersService.clearDraft();
  }

  private fillColsFromFeatureProperties(wfsFeature: WfsFeature) {
    this.cols = [{
      field: 'objectid',
      header: 'ID'
    }];

    Object.keys(wfsFeature.properties).forEach(property => {
      if (property !== 'bbox') {
        this.cols.push({
          field: property,
          header: property
        });
      }
    });
  }

  /**
   * Немогу запихнуть в таблицу фичу как она есть: WfsFeature,
   * поэтому в этом компоненте определена своя модель AttributeFeature.
   * В эту модель запихиваю атрибуты оригинальной фичи чтобы иметь возможность делать обратное преобразование из
   * AttributeFeature в WfsFeature.
   * @param feature Фича с геосервера.
   */
  private mapWfsFeatureToAttrFeature(feature: WfsFeature) {
    const viewFeature: AttributeFeature = feature.properties;
    viewFeature.objectid = feature.id.split('.')[1];
    viewFeature.originalFeature = {
      id: feature.id,
      type: feature.type,
      geometry: feature.geometry,
      geometry_name: feature.geometry_name
    };

    return viewFeature;
  }

  private mapAttrFeatureToWfsFeature(feature: AttributeFeature) {
    const featureClone = Object.assign({}, feature);
    delete featureClone['objectid'];
    delete featureClone['originalFeature'];

    return {
      id: feature.originalFeature.id,
      geometry_name: feature.originalFeature.geometry_name,
      geometry: feature.originalFeature.geometry,
      type: feature.originalFeature.type,
      properties: featureClone
    } as WfsFeature;
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selectedFeatures);

    this.selectedFeatures.splice(0, this.selectedFeatures.length);
    this.selectedFeatures.push(...selected);
  }

  setPage(event) {
    console.log('--- +++', event);
  }
}

export interface AttributeFeature {
  objectid: string;
  originalFeature: {
    id: string;
    type: string;
    geometry: WfsGeometry;
    geometry_name: string;
  };
}
