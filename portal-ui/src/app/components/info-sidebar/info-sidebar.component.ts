import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {filter, takeUntil} from 'rxjs/operators';
import {WsMessageType} from '../../services/ws.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventService, IEvent} from '../../services/event.service';
import {ActionType, CommunicationService} from '../../services/communication.service';

@Component({
  selector: 'crg-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.css']
})
export class InfoSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;

  EXPORT = WsMessageType.EXPORT;

  private events: IEvent[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private eventService: EventService,
              private communicationService: CommunicationService) {

  }

  ngOnInit() {
    this.eventService.events$
        .pipe(
          filter(value => !!value),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((events: IEvent[]) => {
          this.events = events;
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeMe() {
    this.communicationService.infoSidebar.emit(ActionType.CLOSE);
  }
}
