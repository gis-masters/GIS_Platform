import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

import {AuthService} from '../../services/auth.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {EventService, IEvent} from '../../services/event.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

import {WorkspaceHeader} from './workspace-header@common';

@Component({
  selector: 'crg-workspace-header',
  templateUrl: './workspace-header@conv.component.html',
  styleUrls: ['./workspace-header@conv.component.scss']
})
export class WorkspaceHeaderComponent extends WorkspaceHeader {

  notificationCounter = 0;

  constructor(protected route: ActivatedRoute,
              protected authService: AuthService,
              protected storageService: LocalStorageService,
              private eventService: EventService,
              private sideBarManager: SideBarManager) {
    super(authService, route, storageService);

    this.eventService
        .events$
        .pipe(
          filter(value => !!value),
          takeUntil(this.unsubscribe$)
        ).subscribe((events: IEvent[]) => this.notificationCounter = events.length);
  }

  notification() {
    this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.SWITCH});
  }
}
