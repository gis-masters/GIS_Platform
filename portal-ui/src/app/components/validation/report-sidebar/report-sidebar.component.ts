import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { openLayersService } from '../../../services/open-layer/open-layers.service';
import { communicationService, ObjectDto } from '../../../services/communication.service';
import { ValidationBrieflyInfo, validationService } from '../../../services/crg/validation.service';
import { IWsMessage, ValidationWsMsg, wsService } from '../../../services/ws.service';
import { sidebars } from '../../../stores/Sidebars.store';
import { ProcessStatus, ProcessType } from '../../../services/models';
import { CrgLayer } from '../../../services/crg/projects.models';
import { currentProject } from '../../../stores/CurrentProject.store';
@Component({
  selector: 'crg-report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isActive: boolean;
  layers: CrgLayer[];

  commonInfo: Map<string, ValidationBrieflyInfo> = new Map<string, ValidationBrieflyInfo>();

  step = 0;
  isValidationInited = false;

  isEditMode = false;
  objectsToEdit: ObjectDto[] = [];

  commonProgress = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {
    this.layers = currentProject.vectorLayers;
    this.updateBrieflyInfo(this.layers);

    communicationService.validationInitiated.on(value => {
      this.isValidationInited = value;
    }, this);
  }

  async ngOnInit() {
    communicationService.editView.on((objects: ObjectDto[]) => {
      this.isEditMode = true;
      this.objectsToEdit = objects;
    }, this);

    wsService.messages$
      .pipe(
        filter(value => !!value),
        filter((msg: IWsMessage) => msg.type === ProcessType.VALIDATION),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((wsMessage: IWsMessage) => this.handleWsMessage(wsMessage.payload as ValidationWsMsg));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.layers = currentProject.vectorLayers;

    this.commonProgress = 0;
    const layersChange = changes['layers'];

    if (layersChange) {
      this.updateBrieflyInfo(this.layers);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
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

  closeMe() {
    openLayersService.clearDraft();
    sidebars.closeBugReport();
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
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
    if (validationWsMsg.status === ProcessStatus.PENDING) {
      this.commonProgress = validationWsMsg.progress;
    } else if (validationWsMsg.status === ProcessStatus.TASK_DONE) {
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

    validationService.getShortInfo(layers).then(
      (response: ValidationBrieflyInfo[]) => {
        this.isValidationInited = false;

        if (!response) {
          this.logger.warn('Cant get layer info', response);
        } else {
          response.forEach((brieflyInfo: ValidationBrieflyInfo) => {
            if (brieflyInfo.status === 'ERROR') {
              this.logger.warn('Error for feature: ', brieflyInfo);
            } else {
              this.commonInfo.set(brieflyInfo.featureName, brieflyInfo);
            }
          });
        }
      },
      error => {
        this.isValidationInited = false;

        this.logger.error('Cant get validation info: ', error);
      }
    );
  }
}
