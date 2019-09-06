import {saveAs} from 'file-saver';
import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnDestroy} from '@angular/core';
import {EventService, IEvent} from '../../services/event.service';
import {DownloadFileService} from '../../services/download-file.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ProcessType} from '../../services/crg/models';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent implements OnDestroy {

  @Input() event: IEvent;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private fileService: DownloadFileService,
              private eventService: EventService) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDescription(): string {
    if (this.event.payload.payload.status === 'PENDING') {
      return this.event.payload.payload.description;
    } else if (this.event.payload.payload.status === 'SUB_DONE') {
      return this.event.payload.payload.description;
    } else if (this.event.payload.payload.status === 'DONE') {
      if (this.event.payload.type === ProcessType.EXPORT) {
        const layerName = this.event.payload.payload['layerName'];
        return layerName ? layerName : 'Готово';
      }
    } else if (this.event.payload.payload.status === 'ERROR') {
      return 'Ошибка экспорта';
    } else {
      this.logger.warn('Unknown status');
      return '';
    }
  }

  isSpinner(): boolean {
    if (!!this.event.payload.payload.progress) {
      return this.event.payload.payload.status === 'PENDING' || this.event.payload.payload.status === 'SUB_DONE';
    } else {
      return false;
    }
  }

  isProgress(): boolean {
    if (!!this.event.payload.payload.progress) {
      return false;
    }

    return this.event.payload.payload.status === 'PENDING' || this.event.payload.payload.status === 'SUB_DONE';
  }

  closeNotice() {
    this.eventService.delete(this.event.id);
  }

  download() {
    const wsMessage = this.event.payload;
    const exportWsMsg = wsMessage.payload as any;

    const fileName = exportWsMsg.payload.split('/')[3];
    this.fileService.download(fileName)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          const blob = new Blob([data], {type: 'text/xml'});

          saveAs(blob, fileName);
        });
  }

  isShowActionBlock(): boolean {
    return this.event.payload.payload.status === 'DONE' || this.event.payload.payload.status === 'ERROR';
  }

  isShowDownloadLink(): boolean {
    return this.event.payload.payload.status === 'DONE';
  }

  getLinkTitle(): string {
    // if (this.event.payload.type === WsMessageType.GML_EXPORT) {
    //   return 'Скачать GML';
    // } else if (this.event.payload.type === WsMessageType.EXPORT) {
    //   return 'Скачать Shape архив';
    // } else {
      return 'Скачать';
    // }
  }
}
