import {NGXLogger} from 'ngx-logger';
import {Component, Input} from '@angular/core';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-view-features',
  templateUrl: './view-features.component.html',
  styleUrls: ['./view-features.component.css']
})
export class ViewFeaturesComponent {

  @Input() isActive: boolean;
  @Input() features: WfsFeature[];

  isEditMode = false;
  selectedFeature: WfsFeature;

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private rulesService: FgistpRulesService,
              private openLayersService: OpenLayersService) { }

  closeMe() {
    this.openLayersService.clearDraft();
    this.sideBarManager.do(SidebarType.FEATURES, ActionType.CLOSE);
  }


  switchMode() {
    this.isEditMode = !this.isEditMode;
  }

  selectFeature(feature: WfsFeature) {
    this.selectedFeature = feature;
    this.isEditMode = true;
  }
}
