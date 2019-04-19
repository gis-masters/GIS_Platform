import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {filter, takeUntil} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {CrgProject} from '../../../services/gis/projects.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {GmlDialogData} from '../../../components/export/export-dilog/export-dialog.component';
import {ActionType, CommunicationService} from '../../../services/communication.service';
import {ValidationDialogData} from '../../../components/validation/validation-dialog/validation-dialog.component';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {WfsFeatureCollection, WfsService} from '../../../services/geoserver/wfs.service';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  currentProject: CrgProject;
  layers: CrgLayer[] = [];

  isValidationDialogShow = false;
  validationDialogData: ValidationDialogData;

  isGmlDialogShow = false;
  gmlDialogData: CrgLayer[];

  isLayersSidebarActive = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private layersService: LayersService,
              private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private wfsService: WfsService,
              private ruleService: FgistpRulesService,
              private storageService: LocalStorageService,
              private communicationService: CommunicationService,
              private openLayers: OpenLayersService) {
    this.currentProject = this.storageService.getProject().crgProject;
    this.communicationService.stepperEvents.emit(3);
  }

  ngOnInit() {
    this.openLayers.createMap();
    this.ruleService.getRules().subscribe();
    this.layersService.fetchLayers(this.currentProject);

    // Подписываемся на слоя чтобы докидывать их на карту
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

          // Позиционируемся на первом из загруженных слоев
          if (this.layers.length > 0) {
            this.wfsService.getFeatures(this.layers[0].complexName)
                .subscribe((layer: WfsFeatureCollection) => this.openLayers.fitToBbox(layer.bbox));
          }
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
  }

}
