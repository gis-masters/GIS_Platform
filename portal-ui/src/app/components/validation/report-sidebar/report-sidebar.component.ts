import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {filter, takeUntil} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {DatastoreService} from '../../../services/geoserver/datastore.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {ValidationResponse, ValidationService} from '../../../services/gis/validation.service';
import {ActionType, CommunicationService, ObjectDto, SidebarType} from '../../../services/communication.service';

@Component({
  selector: 'crg-report-sidebar',
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
          filter(value => !!value && !!value.length),
          takeUntil(this.unsubscribe$)
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
                }, error => {
                  this.isValidationInited = false;

                  this.logger.error('Cant get validation info: ', error);
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

          if (!responses) {
            this.logger.error('Server response is empty');
            this.snackBar.open('Ошибка валидации', 'X', {duration: 10000});
          } else {
            responses.forEach((response: ValidationResponse) => {
              this.commonInfo.set(response.resourceId.split(':')[2], response);
            });
          }
        }, error => {
          this.isValidationInited = false;

          this.logger.error('Cant validate layers: ', error);
          this.snackBar.open('Ошибка валидации', 'X', {duration: 10000});
        });
  }

  closeMe() {
    this.openLayersService.removeBugObjectsLayer();
    this.communicationService.sidebarManager.emit({action: ActionType.CLOSE, target: SidebarType.BUG_REPORT});
  }

  reValidate() {
    const copy = Object.assign([], this.layers);
    this.communicationService.validationDialog.emit({layers: copy});
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }
}
