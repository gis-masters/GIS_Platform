import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { EventService, IEvent } from '../../services/event.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { services } from '../../services/services';
import { sideBarManager, ActionType, SidebarType } from '../../services/side-bar-manager.service';
import { isManagementAllowed } from '../../services/util/permissions';

import { WorkspaceHeader } from './workspace-header@common';

@Component({
  selector: 'crg-workspace-header',
  templateUrl: './workspace-header@conv.component.html',
  styleUrls: ['./workspace-header@conv.component.scss']
})
export class WorkspaceHeaderComponent extends WorkspaceHeader {

  notificationCounter = 0;
  managementAllowed = false;

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

    this.managementAllowed = isManagementAllowed();
  }

  notification() {
    sideBarManager.do({target: SidebarType.INFO, action: ActionType.SWITCH});

    openLayersService.printDebugInfo();
  }

  toContentEditor() {
    services.router.navigateByUrl('/manager');
  }

}
