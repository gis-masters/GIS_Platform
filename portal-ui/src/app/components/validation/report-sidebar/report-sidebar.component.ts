import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {filter} from 'rxjs/operators';
import {StringUtil} from '../../../services/util/StringUtil';
import {ProcessStatus} from '../../../services/process-status';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {
  ValidationBrieflyInfo,
  ValidationInfoResponse,
  ValidationService
} from '../../../services/gis/validation.service';
import {CommunicationService, ObjectDto} from '../../../services/communication.service';
import {IWsMessage, ValidationWsMsg, WsMessageType, WsService} from '../../../services/ws.service';
import {ActionType, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';

@Component({
  selector: 'crg-report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit, OnChanges {

  @Input() isActive: boolean;
  @Input() layers: CrgLayer[];

  commonInfo: Map<string, ValidationBrieflyInfo> = new Map<string, ValidationBrieflyInfo>();

  step = 0;
  isValidationInited = false;

  isEditMode = false;
  objectsToEdit: ObjectDto[] = [];

  commonProgress = 0;

  constructor(private logger: NGXLogger,
              private wsService: WsService,
              private snackBar: MatSnackBar,
              private validationService: ValidationService,
              private sideBarManager: SideBarManager,
              private communicationService: CommunicationService,
              private openLayersService: OpenLayersService) {
    this.communicationService
        .selectedForValidationLayers$()
        .subscribe((data: CrgLayer[]) => this.initValidation(data));
  }

  ngOnInit() {
    this.communicationService
        .editView$()
        .subscribe((objects: ObjectDto[]) => {
          this.isEditMode = true;
          this.objectsToEdit = objects;
        });

    this.wsService.messages$
        .pipe(
          filter(value => !!value),
          filter((msg: IWsMessage) => msg.type === WsMessageType.VALIDATION_INIT),
        )
        .subscribe((wsMessage: IWsMessage) => this.handleWsMessage(wsMessage.payload as ValidationWsMsg));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layers']) {
      this.updateBrieflyInfo(this.layers);
    }
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
        .subscribe((response: ValidationWsMsg) => {
          if (!response) {
            this.isValidationInited = false;
            this.logger.error('Server response is empty', response);
            this.snackBar.open('Ошибка валидации', 'X', {duration: 10000});
          }
        }, error => {
          this.isValidationInited = false;
          this.logger.error('Cant validate layers: ', error);
          this.snackBar.open('Ошибка валидации', 'X', {duration: 10000});
        });
  }

  closeMe() {
    this.openLayersService.removeBugObjectsLayer();
    this.sideBarManager.do(SidebarType.BUG_REPORT, ActionType.CLOSE);
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
        .getLayerStatistic(layers)
        .subscribe((infoResponse: ValidationInfoResponse) => {
          this.isValidationInited = false;

          if (!infoResponse) {
            this.logger.warn('Cant get layer info', infoResponse);
          } else {
            infoResponse.briefly.forEach((brieflyInfo: ValidationBrieflyInfo) => {
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

}
