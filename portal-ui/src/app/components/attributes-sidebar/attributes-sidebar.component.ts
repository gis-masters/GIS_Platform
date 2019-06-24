import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WfsFeature, WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {CrgLayer} from '../../services/geoserver/layers.service';
import {LazyLoadEvent} from 'primeng/api';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements OnInit, OnChanges {

  @Input() layer: CrgLayer;

  features: WfsFeature[] = [];
  totalFeatures: number;

  selectedFeatures: any;
  cols = [];

  loading = true;

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService) { }

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
    this.wfsService.getFeatures(this.layer.complexName, event.first, event.rows)
        .subscribe((fCollection: WfsFeatureCollection) => {
          if (fCollection) {
            this.loading = false;

            this.totalFeatures = fCollection.totalFeatures;
            this.makeColsFromFeatureProperties(fCollection.features[0]);

            this.features = fCollection.features.map((feature: WfsFeature) => {
              const viewFeature = feature.properties;
              viewFeature['id'] = feature.id.split('.')[1];

              return viewFeature;
            });
          }
        });
  }

  onRowSelect(event) {
    console.log('Selected: ', event.data);
  }

  onRowUnselect(event) {
    console.log('UnSelected: ', event.data);
  }

  closeMe() {
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  private makeColsFromFeatureProperties(wfsFeature: WfsFeature) {
    this.cols = [{
      field: 'id',
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

}
