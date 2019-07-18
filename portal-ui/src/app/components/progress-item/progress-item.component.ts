import {saveAs} from 'file-saver';
import {NGXLogger} from 'ngx-logger';
import {Component, Input} from '@angular/core';
import {EventService, IEvent} from '../../services/event.service';
import {ExportWsMsg, WsMessageType} from '../../services/ws.service';
import {DownloadFileService} from '../../services/download-file.service';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent {

  @Input() event: IEvent;

  constructor(private logger: NGXLogger,
              private fileService: DownloadFileService,
              private eventService: EventService) {
  }

  getDescription(): string {
    if (this.event.payload.payload.status === 'PENDING') {
      return this.event.payload.payload.description;
    } else if (this.event.payload.payload.status === 'SUB_DONE') {
      return this.event.payload.payload.description;
    } else if (this.event.payload.payload.status === 'DONE') {
      if (this.event.payload.type === WsMessageType.GML_EXPORT) {
        return 'Готово';
      } else if (this.event.payload.type === WsMessageType.EXPORT) {
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

  isInProgress(): boolean {
    return this.event.payload.payload.status === 'PENDING' || this.event.payload.payload.status === 'SUB_DONE';
  }

  closeNotice() {
    this.eventService.delete(this.event.id);
  }

  download(mode) {
    let fileName;
    const wsMessage = this.event.payload;
    const exportWsMsg = wsMessage.payload as ExportWsMsg;

    if (mode) {
      fileName = exportWsMsg.pathToFile.split('/')[3];
    } else {
      fileName = exportWsMsg.pathToLog.split('/')[3];
    }

    this.fileService.download(fileName)
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
    if (this.event.payload.type === WsMessageType.GML_EXPORT) {
      return 'Скачать GML';
    } else if (this.event.payload.type === WsMessageType.EXPORT) {
      return 'Скачать Shape архив';
    } else {
      return 'Скачать';
    }
  }
}
