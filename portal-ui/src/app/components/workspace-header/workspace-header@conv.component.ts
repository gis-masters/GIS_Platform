import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { EventService, IEvent } from '../../services/event.service';
import { sideBarManager, ActionType, SidebarType } from '../../services/side-bar-manager.service';

import { WorkspaceHeader } from './workspace-header@common';

@Component({
  selector: 'crg-workspace-header',
  templateUrl: './workspace-header@conv.component.html',
  styleUrls: ['./workspace-header@conv.component.scss']
})
export class WorkspaceHeaderComponent extends WorkspaceHeader {

  notificationCounter = 0;

  constructor(protected route: ActivatedRoute,
              protected authService: AuthService,
              private eventService: EventService) {
    super(authService, route);

    this.eventService
        .events$
        .pipe(
          filter(value => !!value),
          takeUntil(this.unsubscribe$)
        ).subscribe((events: IEvent[]) => this.notificationCounter = events.length);
  }

  notification() {
    sideBarManager.do({target: SidebarType.INFO, action: ActionType.SWITCH});
  }
}
