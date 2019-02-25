import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {DatastoreService} from '../../../services/geoserver/datastore.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {CommunicationService, ObjectDto} from '../../../services/communication.service';
import {ValidationResponse, ValidationService} from '../../../services/gis/validation.service';

@Component({
  selector: 'report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive: boolean;

  layers: CrgLayer[] = [];
  commonInfo: Map<string, ValidationResponse> = new Map<string, ValidationResponse>();

  step = 0;
  isValidationInited = false;

  isEditMode = false;
  objectsToEdit: ObjectDto[] = [];

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
        )
        .subscribe((layers: CrgLayer[]) => {
          this.isValidationInited = true;

          this.layers = layers;

          if (layers.length < 1) {
            this.isValidationInited = false;
          } else {
            this.validationService
                .getLayerStatistic(layers)
                .subscribe((responses: ValidationResponse[]) => {
                  this.isValidationInited = false;

                  if (!responses) {
                    this.logger.warn('Cant get layer info', responses);
                  } else {
                    responses.forEach((response: ValidationResponse) => {
                      this.commonInfo.set(response.resourceId.split(':')[2], response);
                    });
                  }
                });
          }
        });

    this.communicationService
        .editView$()
        .subscribe((objects: ObjectDto[]) => {
          this.isEditMode = true;
          this.objectsToEdit = objects;
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
        .validateLayers(crgLayers)
        .subscribe((responses: ValidationResponse[]) => {
          this.isValidationInited = false;

          this.logger.info(' * * * validateLayers response* * *', responses);

          responses.forEach((response: ValidationResponse) => {
            this.commonInfo.set(response.resourceId.split(':')[2], response);
          });
        });
  }

  closeSidebar() {
    this.openLayersService.removeBugObjectsLayer();
    this.communicationService.bugReportSidebar.emit(false);
  }

  reValidate() {
    const copy = Object.assign([], this.layers);
    this.communicationService.validationDialog.emit({layers: copy});
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }
}
