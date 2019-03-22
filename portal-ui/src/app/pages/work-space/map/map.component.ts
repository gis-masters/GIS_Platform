import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {MatListOption, MatSelectionList, MatSnackBar} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {
  ActionType,
  CommunicationService,
  ObjectDto,
  SidebarData,
  SidebarType
} from '../../../services/communication.service';
import {ValidationDialogData} from '../../../components/validation/validation-dialog/validation-dialog.component';
import {GmlDialogData} from '../../../components/export/export-dilog/export-dialog.component';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  layers: CrgLayer[] = [];

  isLayerObjectsSidebarShow = false;
  layerObjectsSidebarSize = 'ui-sidebar-md';

  isValidationDialogShow = false;
  validationDialogData: ValidationDialogData;

  isGmlDialogShow = false;
  gmlDialogData: CrgLayer[];

  private unsubscribe$: Subject<void> = new Subject<void>();
  private isLayersSidebarActive = false;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router,
              private layersService: LayersService,
              private logger: NGXLogger,
              private snackBar: MatSnackBar,
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

          this.layers.forEach((layer, index) => {
            this.openLayers
                .addLayerToMap(layer.complexName)
                .setZIndex(layers.length - index);
          });
        });

    this.communicationService
        .sidebarManager$()
        .subscribe((data: SidebarData) => {
          switch (data.action) {
            case ActionType.CLOSE: this.isLayersSidebarActive = false; break;
            case ActionType.OPEN: this.isLayersSidebarActive = true;  break;
            case ActionType.SWITCH: this.isLayersSidebarActive = !this.isLayersSidebarActive; break;
            default:
              this.logger.warn('Unsupported action type: ', data.action);
          }
        });

    this.communicationService
        .gotoObject$()
        .subscribe((objectDto: ObjectDto) => {
          this.openLayers.showObject(objectDto);
        });

    this.communicationService
        .validationDialog$()
        .subscribe((data: ValidationDialogData) => {
          if (data && data.layers.length > 0) {
            this.isValidationDialogShow = true;
            this.validationDialogData = data;
          } else {
            this.logger.warn('Empty data: ', data);
            this.snackBar.open('Отсутствуют данные. Начните свою работу с загрузки слоев.', 'X',
              {duration: 10000});
          }
        });

    this.communicationService
        .gmlDialog$()
        .subscribe((data: GmlDialogData) => {
          if (data.action === ActionType.CLOSE) {
            this.isGmlDialogShow = false;
          } else {
            if (data.layers.length > 0) {
              this.isGmlDialogShow = true;
              this.gmlDialogData = data.layers;
            } else {
              this.logger.warn('Empty data: ', data.layers);
              this.snackBar.open('Отсутствуют данные. Начните свою работу с загрузки слоев.', 'X',
                {duration: 10000});
            }
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

  switchLayersSidebar() {
    this.communicationService.sidebarManager.emit({target: SidebarType.LAYERS, action: ActionType.SWITCH});
  }
}
