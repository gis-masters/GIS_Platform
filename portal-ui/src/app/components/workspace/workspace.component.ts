import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { communicationService } from '../../services/communication.service';
import { localStorageService } from '../../services/local-storage.service';
import { ActionType, Sidebar, SidebarType } from '../../services/side-bar-manager.service';
import { cn } from '../../services/util/cn';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnDestroy, OnInit {
  cn = cn('workspace');

  isInfoSidebarActive = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute) {
    communicationService.sidebarManager
        .pipe(
          filter((data: Sidebar) => data.target === SidebarType.INFO),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((data: Sidebar) => {
          switch (data.action) {
            case ActionType.CLOSE:
              this.isInfoSidebarActive = false;
              break;
            case ActionType.OPEN:
              this.isInfoSidebarActive = true;
              break;
            case ActionType.SWITCH:
              this.isInfoSidebarActive = !this.isInfoSidebarActive;
              break;
          }
        });
  }

  ngOnInit(): void {
    this.route.data
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          const userModel = data['orgInfo'];
          if (userModel) {
            localStorageService.saveUserModel(userModel);
          }
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
