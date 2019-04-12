import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {filter, takeUntil} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {GmlDialogData} from '../../../components/export/export-dilog/export-dialog.component';
import {ActionType, CommunicationService, ObjectDto} from '../../../services/communication.service';
import {ValidationDialogData} from '../../../components/validation/validation-dialog/validation-dialog.component';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

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
              private communicationService: CommunicationService,
              private openLayers: OpenLayersService,
              private ruleService: FgistpRulesService) {
  }

  ngOnInit() {
    this.openLayers.createMap();

    this.ruleService.getRules()
        .subscribe(value => this.layersService.fetchLayers());

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
  }

}
