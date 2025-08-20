import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { communicationService } from '../../../services/communication.service';
import { ProcessStatus, ProcessType, WsImportModel } from '../../../services/data/processes/processes.models';
import { ValidationShortInfo } from '../../../services/data/validation/validation.models';
import { getValidationShortInfo } from '../../../services/data/validation/validation.service';
import { CrgLayer, CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { ExportWsMsg, IWsMessage, ValidationWsMsg, wsService } from '../../../services/ws.service';
import { currentProject } from '../../../stores/CurrentProject.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { ObjectDto } from '../../edit-bug-object/edit-bug-object.component';

@Component({
  selector: 'crg-report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isActive: boolean = false;
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef;
  layers: CrgVectorLayer[];

  commonInfo: Map<string, ValidationShortInfo> = new Map<string, ValidationShortInfo>();

  step = 0;
  isValidationInited = false;

  isEditMode = false;
  objectsToEdit: ObjectDto[] = [];

  commonProgress = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();
  layersWithErrors: CrgLayer[] = [];

  constructor(private logger: NGXLogger) {
    this.layers = currentProject.vectorLayers;
    void this.updateBrieflyInfo(this.layers);
    this.layersWithErrors = this.layers.filter(layer => this.commonInfo.get(layer.tableName)?.totalViolations);

    communicationService.validationInitiated.on((e: CustomEvent<boolean>) => {
      this.isValidationInited = e.detail;
    }, this);
  }

  ngOnInit() {
    communicationService.editBugObject.on((e: CustomEvent<ObjectDto[]>) => {
      this.isEditMode = true;
      this.objectsToEdit = e.detail;
    }, this);

    wsService.messages$
      .pipe(
        filter(value => !!value),
        filter((msg: IWsMessage | undefined) => msg?.type === ProcessType.VALIDATION),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(wsMessage => this.handleWsMessage(wsMessage?.payload));
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
    mapDrawService.clearDraft();
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

  private async handleWsMessage(validationWsMsg?: ExportWsMsg | ValidationWsMsg | WsImportModel) {
    switch (validationWsMsg?.status) {
      case ProcessStatus.PENDING: {
        this.commonProgress = validationWsMsg.progress;

        break;
      }
      case ProcessStatus.TASK_DONE: {
        // есть инфа о названии слоя
        this.commonInfo.set(validationWsMsg.description, {
          featureName: '',
          status: '',
          validated: false,
          totalViolations: 0,
          lastValidationDateTime: ''
        });

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

  private async updateBrieflyInfo(layers: CrgVectorLayer[]) {
    if (!layers || layers.length === 0) {
      return;
    }

    try {
      const response: ValidationShortInfo[] = await getValidationShortInfo(layers);

      this.isValidationInited = false;

      if (response) {
        response.forEach((brieflyInfo: ValidationShortInfo) => {
          if (brieflyInfo.status === 'ERROR') {
            this.logger.warn('Error for feature: ', brieflyInfo);
          } else {
            this.commonInfo.set(brieflyInfo.featureName, brieflyInfo);
          }
        });
        this.layersWithErrors = this.layers.filter(layer => this.commonInfo.get(layer.tableName)?.totalViolations);
      } else {
        this.logger.warn('Cant get layer info', response);
      }
    } catch (error) {
      this.isValidationInited = false;

      this.logger.error('Cant get validation info: ', error);
    }
  }
}
