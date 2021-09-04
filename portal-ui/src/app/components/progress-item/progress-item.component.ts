import { Component, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { saveAsBlob } from '../../services/util/FileSaver';
import { eventService, IEvent } from '../../services/event.service';
import { DownloadFileService } from '../../services/download-file.service';
import { ProcessStatus, ProcessType } from '../../services/models';
import { ExportWsMsg, IWsMessage } from '../../services/ws.service';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent implements OnDestroy {
  @Input() event: IEvent;

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
        if (this.event.payload.type === ProcessType.EXPORT || this.event.payload.type === ProcessType.VALIDATION_REPORT) {
          const layerName = this.event.payload.payload.description;

          return layerName ? layerName : 'Готово';
        }

        break;
      }
      case ProcessStatus.ERROR: {
        return 'Ошибка экспорта';
      }
      default: {
        this.logger.warn('Unknown status');

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
    const blob = new Blob([data], { type: 'text/xml' });

    saveAsBlob(fileName, blob);
  }

  isShowActionBlock(): boolean {
    return (
      this.event.payload.payload.status === ProcessStatus.DONE ||
      this.event.payload.payload.status === ProcessStatus.ERROR
    );
  }

  isShowDownloadLink(): boolean {
    return this.event.payload.payload.status === ProcessStatus.DONE;
  }
}
