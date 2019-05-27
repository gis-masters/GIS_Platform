import {NGXLogger} from 'ngx-logger';
import {MatPaginator} from '@angular/material';
import {PageEvent} from '@angular/material/typings/paginator';
import {WfsFeature} from '../../services/geoserver/wfs.service';
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
  @Input() features: WfsFeature[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isEditMode = false;
  selectedFeature: WfsFeature;
  pageIndex = 0;

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private rulesService: FgistpRulesService,
              private openLayers: OpenLayersService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['features']) {
      if (this.features && this.features.length === 1) {
        this.selectFeature(this.features[0]);
      } else if (this.features && this.features.length > 1) {
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
    this.sideBarManager.do(SidebarType.FEATURES, ActionType.CLOSE);
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }

  selectFeature(feature: WfsFeature) {
    this.selectedFeature = feature;
    this.isEditMode = true;
  }

  handlePageEvent(event: PageEvent) {
    console.log('handlePageEvent', event);
    this.pageIndex = event.pageIndex;
  }
}
