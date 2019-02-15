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
import {CommunicationService, ObjectDto} from "../../../services/communication.service";
import {FgistpRulesService} from "../../../services/gis/fgistp-rules.service";
import {flatMap} from "rxjs/operators";

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  layersComplexName = [];

  isLayerObjectsSidebarShow: boolean = false;
  layerObjectsSidebarSize = 'ui-sidebar-md';

  isBugReportSidebarShow: boolean = false;
  bugReportSidebarSize = 'ui-sidebar-md';

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router,
              private layersService: LayersService,
              private logger: NGXLogger,
              private communicationService: CommunicationService,
              private openLayers: OpenLayersService,
              private ruleService: FgistpRulesService,
              private authService: AuthService) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.openLayers.createMap();

    this.ruleService.getRules()
        .pipe(
          flatMap((data) => this.layersService.getAll()),
        )
        .subscribe((layers: NameHrefProjection[]) => {
          this.layersComplexName = layers.map((item: NameHrefProjection) => item.name);

          this.layersComplexName.forEach((complexLayerName, index) => {
            this.openLayers
                .addLayerToMap(complexLayerName)
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
        .subscribe((objectDto: ObjectDto) => {
          this.openLayers.showObject(objectDto);
        });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layersComplexName, event.previousIndex, event.currentIndex);

    this.layersComplexName.forEach((layerName, index) => {
      this.openLayers.set_ZIndex(layerName, this.layersComplexName.length - index);
    });
  }

  handleSelection(selectionList: MatSelectionList) {
    // Только выбранные галочкой элементы
    const nameOfSelectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => {
        return this.ruleService.getNativeLayerNameByTitle(selectedOption.getLabel());
      });
    this.openLayers.changeLayersVisibility(nameOfSelectedLayers);
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
