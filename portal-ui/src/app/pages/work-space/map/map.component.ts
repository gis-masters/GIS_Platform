import {Subject} from "rxjs";
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {filter, takeUntil} from "rxjs/operators";
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from "../../../services/gis/fgistp-rules.service";
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {CommunicationService, ObjectDto} from "../../../services/communication.service";
import {ValidationDialogData} from "../../../components/validation/validation-dialog/validation-dialog.component";

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  layers: CrgLayer[] = [];

  isLayerObjectsSidebarShow: boolean = false;
  layerObjectsSidebarSize = 'ui-sidebar-md';

  isBugReportSidebarShow: boolean = false;
  bugReportSidebarSize = 'ui-sidebar-md';

  isValidationDialogShow: boolean = false;
  validationDialogData: ValidationDialogData;

  isEditDialogShow: boolean = false;
  objectsToEdit: ObjectDto[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

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
        .subscribe(value => this.layersService.fetchLayers());

    this.layersService.layers$
        .pipe(
          filter(value => !!value && !!value.length),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((layers: CrgLayer[]) => {
          this.layers = layers;

          this.logger.debug('addLayers: ', layers);

          this.layers.forEach((layer, index) => {
            this.openLayers
                .addLayerToMap(layer.complexName)
                .setZIndex(layers.length - index);
          });
        });

    this.communicationService
        .layerObjectsSidebar$()
        .subscribe((value) => {
          this.isLayerObjectsSidebarShow = value;
        });

    this.communicationService
        .bugReportSidebar$()
        .subscribe((value) => {
          this.isBugReportSidebarShow = value;
        });

    this.communicationService
        .gotoObject$()
        .subscribe((objectDto: ObjectDto) => {
          this.openLayers.showObject(objectDto);
        });

    // this.communicationService
    //     .editView$()
    //     .subscribe((objects: ObjectDto[]) => {
    //       this.isEditDialogShow = true;
    //       this.objectsToEdit = objects;
    //     });

    this.communicationService
        .validationDialog$()
        .subscribe((data: ValidationDialogData) => {
          if (data && data.layers.length > 0) {
            this.isValidationDialogShow = true;
            this.validationDialogData = data;
          } else {
            this.logger.warn('Empty data: ', data);
          }
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.layers.forEach((layer, index) => {
      this.openLayers.set_ZIndex(layer.name, this.layers.length - index);
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

}
