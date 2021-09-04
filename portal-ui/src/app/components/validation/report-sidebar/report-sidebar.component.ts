import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { mapService } from '../../../services/map/map.service';
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
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;
  layers: CrgLayer[];

  commonInfo: Map<string, ValidationBrieflyInfo> = new Map<string, ValidationBrieflyInfo>();

  step = 0;
  isValidationInited = false;

  isEditMode = false;
  objectsToEdit: ObjectDto[] = [];

  commonProgress = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();
  layersWithErrors: CrgLayer[];

  constructor(private logger: NGXLogger) {
    this.layers = currentProject.vectorLayers;
    void this.updateBrieflyInfo(this.layers);
    this.layersWithErrors = this.layers.filter(layer => this.commonInfo.get(layer.tableName)?.totalViolations)

    communicationService.validationInitiated.on(value => {
      this.isValidationInited = value;
    }, this);
  }

  ngOnInit() {
    communicationService.editBugObject.on((objects: ObjectDto[]) => {
      this.isEditMode = true;
      this.objectsToEdit = objects;
    }, this);

    wsService.messages$
      .pipe(
        filter(value => !!value),
        filter((msg: IWsMessage) => msg.type === ProcessType.VALIDATION),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((wsMessage: IWsMessage<ValidationWsMsg>) => this.handleWsMessage(wsMessage.payload));
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.layers = currentProject.vectorLayers;

    this.commonProgress = 0;
    const layersChange = changes.layers;

    if (layersChange) {
      await this.updateBrieflyInfo(this.layers);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  closeMe(): void {
    mapService.clearDraft();
    sidebars.closeBugReport();
  }

  switchMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  isDone(name: string): boolean {
    const brieflyInfo = this.commonInfo.get(name);
    if (brieflyInfo) {
      return brieflyInfo.validated && brieflyInfo.totalViolations < 1;
    }

    return false;
  }

  private async handleWsMessage(validationWsMsg: ValidationWsMsg) {
    switch (validationWsMsg.status) {
      case ProcessStatus.PENDING: {
        this.commonProgress = validationWsMsg.progress;

        break;
      }
      case ProcessStatus.TASK_DONE: {
        // есть инфа о названии слоя
        this.commonInfo.set(validationWsMsg.description, null);

        break;
      }
      case ProcessStatus.DONE: {
        this.isValidationInited = false;
        await this.updateBrieflyInfo(this.layers);

        break;
      }
      default: {
        this.logger.warn('Unknown processStatus');
      }
    }
  }

  private async updateBrieflyInfo(layers: CrgLayer[]) {
    if (!layers || layers.length === 0) {
      return;
    }

    try {
      const response: ValidationBrieflyInfo[] = await validationService.getShortInfo(layers);

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
        this.layersWithErrors = this.layers.filter(layer => this.commonInfo.get(layer.tableName)?.totalViolations)
      }
    } catch (error) {
      this.isValidationInited = false;

      this.logger.error('Cant get validation info: ', error);
    }
  }
}
