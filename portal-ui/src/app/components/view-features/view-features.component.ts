import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnInit} from '@angular/core';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-view-features',
  templateUrl: './view-features.component.html',
  styleUrls: ['./view-features.component.css']
})
export class ViewFeaturesComponent implements OnInit {

  @Input() isActive: boolean;
  @Input() features: WfsFeature[];

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private openLayersService: OpenLayersService) { }

  ngOnInit() {
  }

  closeMe() {
    this.openLayersService.clearDraft();
    this.sideBarManager.do(SidebarType.FEATURES, ActionType.CLOSE);
  }
}
