import {Util} from './util';
import {NGXLogger} from 'ngx-logger';
import {MatPaginator} from '@angular/material';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {EditFeatureData, EditFeatureMode} from '../edit-feature/edit-feature.component';
import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-view-features',
  templateUrl: './view-features.component.html',
  styleUrls: ['./view-features.component.css']
})
export class ViewFeaturesComponent implements OnChanges, OnInit {

  @Input() data: ViewFeaturesData;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isEditMode = false;
  isSingleEdit = true;
  isAttributeSidebarOpened = false;
  editFeatureData: EditFeatureData;

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private rulesService: FgistpRulesService,
              private openLayers: OpenLayersService) {
  }

  ngOnInit(): void {
    if (this.data.mode === EditFeatureMode.multipleEdit) {
      this.editFeatureData = Util.prepareFeatureForMultipleEdit(this.data.features);
      this.isEditMode = true;
    } else {
      this.selectFeature(this.data.features[0]);
    }

    this.sideBarManager.currentState$
        .subscribe(sidebarsState => {
          const attrSidebarState = sidebarsState[SidebarType.ATTRIBUTES];
          if (attrSidebarState === ActionType.OPEN) {
            this.isAttributeSidebarOpened = true;
          } else {
            this.isAttributeSidebarOpened = false;
          }
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];
    if (dataChanged && !dataChanged.isFirstChange()) {
      const currentValue = dataChanged.currentValue as ViewFeaturesData;
      if (currentValue && currentValue.features && currentValue.features.length === 1) {
        this.selectFeature(currentValue.features[0]);
      } else if (currentValue && currentValue.features && currentValue.features.length > 1) {
        if (currentValue.mode === EditFeatureMode.multipleEdit) {
          this.editFeatureData = Util.prepareFeatureForMultipleEdit(currentValue.features);
          this.isEditMode = true;
        } else {
          this.isEditMode = false;
        }
      }
    }
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }

  selectFeature(feature: WfsFeature) {
    this.isEditMode = true;
    this.isSingleEdit = true;
    this.editFeatureData = {feature: feature, mode: EditFeatureMode.single} as EditFeatureData;
  }

  closeMe() {
    this.openLayers.clearDraft();
    this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.CLOSE});
  }

}

export interface ViewFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
}
