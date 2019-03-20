import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnInit} from '@angular/core';
import {EventService, IEvent} from '../../services/event.service';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent implements OnInit {

  @Input() event: IEvent;

  isDone = false;
  isHide = false;
  isDownload = true;

  constructor(private logger: NGXLogger,
              private eventService: EventService) {
  }

  ngOnInit() {
  }

  clickByLeft() {
    this.isDone = !this.isDone;
  }

  closeNotice() {
    this.eventService.delete(this.event.id);
  }

  download() {
    this.isDownload = !this.isDownload;
  }
}
