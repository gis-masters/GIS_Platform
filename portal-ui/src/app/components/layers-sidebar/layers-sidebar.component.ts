import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventService} from '../../services/event.service';
import {ActionType, CommunicationService, SidebarType} from '../../services/communication.service';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.css']
})
export class LayersSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private eventService: EventService,
              private communicationService: CommunicationService) {

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeMe() {
    this.communicationService.sidebarManager.emit({action: ActionType.CLOSE, target: SidebarType.LAYERS});
  }
}
