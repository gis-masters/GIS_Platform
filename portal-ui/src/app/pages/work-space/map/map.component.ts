import {NGXLogger} from 'ngx-logger';
import {Subject, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {catchError, tap} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {CrgProject} from '../../../services/gis/projects.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {ActionType, CommunicationService} from '../../../services/communication.service';
import {WfsFeatureCollection, WfsService} from '../../../services/geoserver/wfs.service';
import {GmlDialogData} from '../../../components/export/export-dilog/export-dialog.component';
import {ValidationDialogData} from '../../../components/validation/validation-dialog/validation-dialog.component';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  currentProject: CrgProject;

  layers: CrgLayer[] = undefined;

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
    this.communicationService.stepperEvents.emit(3);
  }

  ngOnInit() {
    this.openLayers.createMap();
    this.ruleService.getRules().subscribe();

    this.currentProject = this.storageService.getProject().crgProject;
    this.layersService.fizFetchingLayers(this.currentProject)
      .pipe(
        tap(layers => this.layers = layers),
        catchError(err => {
          this.logger.error('layers-sidebar layers error', err);
          return throwError(err);
        })
      ).subscribe((layers: CrgLayer[]) => {
        layers.forEach((layer, index) => {
          this.openLayers
              .addLayerToMap(layer.complexName)
              .setZIndex(layers.length - index);
        });

        // Позиционируемся на первом из загруженных слоев
        if (layers.length > 0) {
          this.wfsService.getFeatures(layers[0].complexName)
              .subscribe((layer: WfsFeatureCollection) => {
                if (layer && layer.bbox) {
                  this.openLayers.fitToBbox(layer.bbox, [50, 50, 50, 50]);
                } else {
                  this.logger.info('Cant position to layer', layer);
                }
              });
        }
      });

    this.communicationService
        .validationDialog$()
        .subscribe((data: ValidationDialogData) => {
          if (data && data.show) {
            this.isValidationDialogShow = true;

            if (data.layers && data.layers.length > 0) {
              this.validationDialogData = data;
            } else {
              this.logger.warn('Empty data: ', data);
              this.snackBar.open('Отсутствуют данные. Начните свою работу с загрузки слоев.', 'X',
                {duration: 10000});
            }
          } else {
            this.isValidationDialogShow = false;
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
