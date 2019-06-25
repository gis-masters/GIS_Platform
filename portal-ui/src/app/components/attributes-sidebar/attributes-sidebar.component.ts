import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WfsFeature, WfsFeatureCollection, WfsGeometry, WfsService} from '../../services/geoserver/wfs.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {LazyLoadEvent} from 'primeng/api';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements OnInit, OnChanges {

  @Input() layer: CrgLayer;

  features: AttributeFeature[] = [];
  selectedFeatures: AttributeFeature[];
  totalFeatures: number;

  cols = [];

  loading = true;

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService,
              private openLayersService: OpenLayersService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const layerChanged = changes['layer'];
    if (layerChanged && !layerChanged.isFirstChange()) {
      this.loadObjectsLazy({rows: 20, first: 0});
    }
  }

  loadObjectsLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.wfsService.getFeatures(this.layer.complexName, event)
        .subscribe((fCollection: WfsFeatureCollection) => {
          if (fCollection) {
            this.loading = false;

            this.totalFeatures = fCollection.totalFeatures;
            this.makeColsFromFeatureProperties(fCollection.features[0]);

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
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  private makeColsFromFeatureProperties(wfsFeature: WfsFeature) {
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
