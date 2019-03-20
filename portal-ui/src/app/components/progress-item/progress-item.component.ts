import {NGXLogger} from 'ngx-logger';
import {Component, Input} from '@angular/core';
import {EventService, IEvent} from '../../services/event.service';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent {

  @Input() event: IEvent;

  constructor(private logger: NGXLogger,
              private eventService: EventService) {
  }

  getDescription(): string {
    if (this.event.payload.payload.status === 'PENDING') {
      return this.event.payload.payload.description;
    } else if (this.event.payload.payload.status === 'DONE') {
      return 'Готово';
    } else if (this.event.payload.payload.status === 'ERROR') {
      return 'Ошибка экспорта';
    } else {
      return '';
    }
  }

  closeNotice() {
    this.eventService.delete(this.event.id);
  }

  download() {

  }

  isShowActionBlock() {
    return this.event.payload.payload.status === 'DONE' || this.event.payload.payload.status === 'ERROR';
  }

  isShowDownloadLink() {
    return this.event.payload.payload.status === 'DONE';
  }
}
