import { Component, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { DownloadFileService } from '../../services/download-file.service';
import { eventService, IEvent } from '../../services/event.service';
import { ProcessStatus, ProcessType } from '../../services/models';
import { saveAsBlob } from '../../services/util/FileSaver';
import { ExportWsMsg, IWsMessage } from '../../services/ws.service';
import { Mime } from '../../services/util/Mime';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent implements OnDestroy {
  @Input() event: IEvent;

  openResultDialog = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger, private fileService: DownloadFileService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDescription(): string {
    switch (this.event.payload.payload.status) {
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
          this.event.payload.type === ProcessType.IMPORT_RASTER
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
        this.logger.warn('Unknown status. Event is: ', this.event.payload);

        return '';
      }
    }
  }

  inProgress(): boolean {
    return this.event.payload?.payload?.status === ProcessStatus.PENDING;
  }

  isProgress(): boolean {
    if (this.event.payload.payload.progress) {
      return false;
    }

    return (
      this.event.payload.payload.status === ProcessStatus.PENDING ||
      this.event.payload.payload.status === ProcessStatus.TASK_DONE
    );
  }

  closeNotice(): void {
    eventService.delete(this.event.id);
  }

  async download(): Promise<void> {
    const wsMessage: IWsMessage = this.event.payload;
    const exportWsMsg: ExportWsMsg = wsMessage.payload as ExportWsMsg;
    const fileName = exportWsMsg.payload.split('/')[3];
    const data = await this.fileService.download(fileName);
    const blob = new Blob([data], { type: Mime.XML });

    saveAsBlob(fileName, blob);
  }

  isShowActionBlock(): boolean {
    return (
      this.event.payload.payload.status === ProcessStatus.DONE ||
      this.event.payload.payload.status === ProcessStatus.ERROR
    );
  }

  isShowDownloadLink(): boolean {
    const { type, payload } = this.event;

    return (
      type !== ProcessType.IMPORT_GML &&
      type !== ProcessType.IMPORT_RASTER &&
      payload.payload.status === ProcessStatus.DONE
    );
  }
}
