import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {filter, takeUntil} from 'rxjs/operators';
import {StringUtil} from '../../../services/util/StringUtil';
import {ProcessStatus} from '../../../services/process-status';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CommunicationService, ObjectDto} from '../../../services/communication.service';
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ValidationBrieflyInfo, ValidationService} from '../../../services/crg/validation.service';
import {IWsMessage, ValidationWsMsg, WsMessageType, WsService} from '../../../services/ws.service';
import {ActionType, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';

@Component({
  selector: 'crg-report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isActive: boolean;
  @Input() layers: CrgLayer[];

  commonInfo: Map<string, ValidationBrieflyInfo> = new Map<string, ValidationBrieflyInfo>();

  step = 0;
  isValidationInited = false;

  isEditMode = false;
  objectsToEdit: ObjectDto[] = [];

  commonProgress = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private wsService: WsService,
              private snackBar: MatSnackBar,
              private validationService: ValidationService,
              private sideBarManager: SideBarManager,
              private communicationService: CommunicationService,
              private openLayersService: OpenLayersService) {
    this.communicationService
        .selectedForValidation
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: CrgLayer[]) => this.initValidation(data));
  }

  ngOnInit() {
    this.communicationService.editView
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((objects: ObjectDto[]) => {
          this.isEditMode = true;
          this.objectsToEdit = objects;
        });

    this.wsService.messages$
        .pipe(
          filter(value => !!value),
          filter((msg: IWsMessage) => msg.type === WsMessageType.VALIDATION_INIT),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((wsMessage: IWsMessage) => this.handleWsMessage(wsMessage.payload as ValidationWsMsg));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.commonProgress = 0;
    const isActiveChange = changes['isActive'];
    const layersChange = changes['layers'];
    if (isActiveChange && isActiveChange.currentValue) {
      this.updateBrieflyInfo(this.layers);
    }

    if (layersChange && this.isActive) {
      this.updateBrieflyInfo(this.layers);
    }
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
        .initValidation(crgLayers)
        .subscribe((response: ValidationWsMsg) => {
          if (response) {
            // TODO: Ничего не предпринимаем здесь. Ждем сообщений из websocet. А надо бы отследивать процесс
            //  страхуя websocet
            this.logger.debug('return process', response);
          } else {
            this.showError();
          }
        }, error => {
          this.showError(error);
        });
  }

  closeMe() {
    this.openLayersService.clearDraft();
    this.sideBarManager.do({target: SidebarType.BUG_REPORT, action: ActionType.CLOSE});
  }

  reValidate() {
    if (this.layers && this.layers.length > 0) {
      const copy = Object.assign([], this.layers);
      this.communicationService.validationDialog.emit({show: true, layers: copy});
    } else {
      this.logger.info('Не подгружены слоя');
    }
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }

  getGeometryType(name: string) {
    return StringUtil.splitGeomType(name);
  }

  isDone(name: string) {
    const brieflyInfo = this.commonInfo.get(name);
    if (brieflyInfo) {
      return brieflyInfo.validated && brieflyInfo.totalViolations < 1;
    } else {
      return false;
    }
  }

  private handleWsMessage(validationWsMsg: ValidationWsMsg) {
    // this.logger.info('handleWsMessage:', validationWsMsg);

    if (validationWsMsg.status === ProcessStatus.PENDING) {
      this.commonProgress = validationWsMsg.progress;
    } else if (validationWsMsg.status === ProcessStatus.SUB_DONE) {
      // есть инфа о названии слоя
      this.commonInfo.set(validationWsMsg.description, null);
    } else if (validationWsMsg.status === ProcessStatus.DONE) {
      this.isValidationInited = false;
      this.updateBrieflyInfo(this.layers);
    }
  }

  private updateBrieflyInfo(layers: CrgLayer[]) {
    if (!layers || layers.length === 0) {
      return;
    }

    this.validationService
        .getShortInfo(layers)
        .subscribe((response: ValidationBrieflyInfo[]) => {
          this.isValidationInited = false;

          if (!response) {
            this.logger.warn('Cant get layer info', response);
          } else {
            // console.log('new SHORT response', response);

            response.forEach((brieflyInfo: ValidationBrieflyInfo) => {
              if (brieflyInfo.status === 'ERROR') {
                this.logger.warn('Error for feature: ', brieflyInfo);
              } else {
                this.commonInfo.set(brieflyInfo.featureName, brieflyInfo);
              }
            });
          }
        }, error => {
          this.isValidationInited = false;

          this.logger.error('Cant get validation info: ', error);
        });
  }

  private showError(error?) {
    this.isValidationInited = false;
    this.logger.error('Cant validate layers: ', error);
    this.snackBar.open('Ошибка валидации', 'X', {duration: 10000});
  }

}
