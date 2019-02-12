import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {LayersService} from '../../../services/geoserver/layers.service';
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  layerNames = [];

  isLayerObjectsSidebarShow: boolean = false;
  layerObjectsSidebarSize = 'ui-sidebar-md';

  isBugReportSidebarShow: boolean = false;
  bugReportSidebarSize = 'ui-sidebar-sm';

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router,
              private layersService: LayersService,
              private logger: NGXLogger,
              private communicationService: CommunicationService,
              private openLayers: OpenLayersService,
              private authService: AuthService) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.openLayers.createMap();

    this.layersService.getAll()
      .subscribe((layers: NameHrefProjection[]) => {
        this.layerNames = layers.map((item: NameHrefProjection) => item.name);

        this.layerNames.forEach((layerName, index) => {
          this.openLayers
              .addLayerToMap(layerName)
              .setZIndex(layers.length - index);
        });
      });

    this.communicationService
        .layerObjectsSidebarListener()
        .subscribe((value) => {
          this.isLayerObjectsSidebarShow = value;
        });

    this.communicationService
        .bugReportSidebarListener()
        .subscribe((value) => {
          this.isBugReportSidebarShow = value;
        });

    this.communicationService
        .gotoObjectListener()
        .subscribe((objectId) => {
          this.openLayers.positionToObjectById(objectId);
        });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layerNames, event.previousIndex, event.currentIndex);

    this.layerNames.forEach((layerName, index) => {
      this.openLayers.set_ZIndex(layerName, this.layerNames.length - index);
    });
  }

  handleSelection(selectionList: MatSelectionList) {
    // Только выбранные галочкой элементы
    const selectedLayers = selectionList.selectedOptions.selected.map((selectedOption: MatListOption) => selectedOption.getLabel());
    this.openLayers.changeLayersVisibility(selectedLayers);
  }

  updateMapSize() {
    setTimeout(() => {
      this.openLayers.getMap().updateSize();
    }, 300);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
