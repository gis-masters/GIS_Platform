import { Component, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { downloadExportResult } from '../../services/data/export/export.service';
import { ProcessStatus, ProcessType } from '../../services/data/processes/processes.models';
import { eventService, IEvent } from '../../services/event.service';
import { saveAsBlob } from '../../services/util/FileSaver';
import { Mime } from '../../services/util/Mime';
import { ExportWsMsg, IWsMessage } from '../../services/ws.service';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent implements OnDestroy {
  @Input() event?: IEvent;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDescription(): string {
    switch (this.event?.payload.payload.status) {
      case ProcessStatus.PENDING: {
        return this.event.payload.payload.description;
      }
      case ProcessStatus.TASK_DONE: {
        return this.event.payload.payload.description;
      }
      case ProcessStatus.DONE: {
        if (
          this.event.payload.type === ProcessType.EXPORT ||
          this.event.payload.type === ProcessType.VALIDATION_REPORT ||
          this.event.payload.type === ProcessType.IMPORT_GML ||
          this.event.payload.type === ProcessType.IMPORT_DXF ||
          this.event.payload.type === ProcessType.IMPORT_TAB ||
          this.event.payload.type === ProcessType.IMPORT_MID ||
          this.event.payload.type === ProcessType.IMPORT_SHP ||
          this.event.payload.type === ProcessType.IMPORT_TIF
        ) {
          const layerName = this.event.payload.payload.description;

          return layerName || 'Готово';
        }

        break;
      }
      case ProcessStatus.ERROR: {
        return 'Процесс завершился ошибкой';
      }
      default: {
        this.logger.warn('Unknown status. Event is: ', this.event?.payload);

        return '';
      }
    }

    return '';
  }

  inProgress(): boolean {
    return this.event?.payload?.payload?.status === ProcessStatus.PENDING;
  }

  closeNotice(): void {
    if (this.event) {
      eventService.delete(this.event.id);
    }
  }

  async download(): Promise<void> {
    if (!this.event) {
      return;
    }
    const wsMessage: IWsMessage = this.event.payload;
    const exportWsMsg: ExportWsMsg = wsMessage.payload as ExportWsMsg;
    const fileName = exportWsMsg.payload.split('/')[3];
    const data = await downloadExportResult(fileName);
    const blob = new Blob([data], { type: Mime.XML });

    saveAsBlob(fileName, blob);
  }

  isShowActionBlock(): boolean {
    return (
      this.event?.payload.payload.status === ProcessStatus.DONE ||
      this.event?.payload.payload.status === ProcessStatus.ERROR
    );
  }

  isShowDownloadLink(): boolean {
    if (!this.event) {
      return false;
    }
    const { type, payload } = this.event;

    return (
      type !== ProcessType.IMPORT_GML &&
      type !== ProcessType.IMPORT_DXF &&
      type !== ProcessType.IMPORT_SHP &&
      type !== ProcessType.IMPORT_TAB &&
      type !== ProcessType.IMPORT_MID &&
      type !== ProcessType.IMPORT_TIF &&
      payload.payload.status === ProcessStatus.DONE
    );
  }
}
