import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {filter, takeUntil} from 'rxjs/operators';
import {IWsMessage, WsService} from '../../services/ws.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionType, CommunicationService} from '../../services/communication.service';

@Component({
  selector: 'crg-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.css']
})
export class InfoSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private wsService: WsService,
              private communicationService: CommunicationService) {

  }

  ngOnInit() {
    this.wsService.messages$
        .pipe(
          filter(value => !!value),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((wsMessage: IWsMessage) => {

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
