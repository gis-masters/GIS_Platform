import {NGXLogger} from 'ngx-logger';
import {MatPaginator} from '@angular/material';
import {PageEvent} from '@angular/material/typings/paginator';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {EditFeatureData} from '../edit-feature/edit-feature.component';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-view-features',
  templateUrl: './view-features.component.html',
  styleUrls: ['./view-features.component.css']
})
export class ViewFeaturesComponent implements OnChanges {

  @Input() isActive: boolean;
  @Input() data: ViewFeaturesData;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isEditMode = false;
  isSingleEdit = true;
  editFeatureData: EditFeatureData;
  pageIndex = 0;

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private rulesService: FgistpRulesService,
              private openLayers: OpenLayersService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];
    if (dataChanged && !dataChanged.isFirstChange()) {
      const currentValue = dataChanged.currentValue;
      if (currentValue && currentValue.features && currentValue.features.length === 1) {
        this.selectFeature(currentValue.features[0]);
      } else if (currentValue && currentValue.features && currentValue.features.length > 1) {
        this.isEditMode = false;
      }
    }

    if (changes['isActive']) {
      if (this.isActive === false) {
        this.openLayers.clearDraft();
      }
    }
  }

  closeMe() {
    this.openLayers.clearDraft();
    this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.CLOSE});
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }

  selectFeature(feature: WfsFeature) {
    this.isEditMode = true;
    this.isSingleEdit = true;
    this.editFeatureData = {feature: feature, mode: 'single'} as EditFeatureData;
  }

  handlePageEvent(event: PageEvent) {
    console.log('handlePageEvent', event);
    this.pageIndex = event.pageIndex;
  }
}

export interface ViewFeaturesData {
  features: WfsFeature[];
  mode: string;
}
