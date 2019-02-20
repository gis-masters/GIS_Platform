import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {filter, flatMap, takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from "@angular/material";
import {AuthService} from "../../../services/auth.service";
import {CommunicationService} from "../../../services/communication.service";
import {FgistpRulesService} from "../../../services/gis/fgistp-rules.service";
import {DatastoreService} from '../../../services/geoserver/datastore.service';
import {OpenLayersService} from "../../../services/open-layer/open-layers.service";
import {CrgLayer, LayersService} from "../../../services/geoserver/layers.service";
import {ValidationResponse, ValidationService} from '../../../services/gis/validation.service';
import {Subject} from "rxjs";

@Component({
  selector: 'report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive: boolean;

  layers: CrgLayer[] = [];

  step = 0;
  isValidationInited = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private datastoreService: DatastoreService,
              private validationService: ValidationService,
              private communicationService: CommunicationService,
              private authService: AuthService,
              private dialog: MatDialog,
              private openLayersService: OpenLayersService,
              private ruleService: FgistpRulesService,
              private layersService: LayersService) {
    this.authService.validateAuth();

    this.communicationService
        .selectedForValidationLayers$()
        .subscribe((data: CrgLayer[]) => this.initValidation(data));
  }

  ngOnInit() {
    this.layersService.layers$
        .pipe(
          takeUntil(this.unsubscribe$),
          filter(value => !!value && !!value.length),
          // filter(value => this.isActive),
        )
        .subscribe((layers: CrgLayer[]) => {
          this.isValidationInited = true;

          this.layers = layers;

          if (layers.length < 1) {
            this.isValidationInited = false;
          } else {
            this.validationService
                .getLayersStatistic(layers)
                .subscribe((response: ValidationResponse[]) => {
                  this.isValidationInited = false;

                  this.logger.info('REEEEEEEsponse INFO: ', response);

                  //TODO: сервис сам должен записать эту инфу
                  this.validationService.validationDataHolder.addLayers(response);
                });
          }
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  initValidation(crgLayers: CrgLayer[]) {
    this.isValidationInited = true;

    this.validationService
        .validateLayer(crgLayers[0].connectionInfo)
        .subscribe((data: any) => {
          this.isValidationInited = false;

          this.logger.info(' * * * * * *', data);
        });
  }

  closeSidebar() {
    this.openLayersService.removeBugObjectsLayer();
    this.communicationService.bugReportSidebar.emit(false);
  }

  reValidate() {
    let copy = Object.assign([], this.layers);
    this.communicationService.validationDialog.emit({layers: copy});
  }

  isLayerCommonInfoExist(name: string, param: string) {
    let infoByLayerName = this.validationService.validationDataHolder.getInfoByLayerName(name);
    return infoByLayerName ? !!infoByLayerName[param] : undefined;
  }

  getInfo(name: string, param: string) {
    let infoByLayerName = this.validationService.validationDataHolder.getInfoByLayerName(name);

    return infoByLayerName ? infoByLayerName[param] : undefined;
  }

  isValidatedAndSuccess(name: string) {
    let infoByLayerName = this.validationService.validationDataHolder.getInfoByLayerName(name);

    if (!infoByLayerName) {
      return false;
    }

    return infoByLayerName.validated && infoByLayerName.totalViolations < 1;
  }

}
