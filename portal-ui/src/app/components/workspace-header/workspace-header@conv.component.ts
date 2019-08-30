import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

import {AuthService} from '../../services/auth.service';
import {UserInfoModel} from '../../services/crg/users.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {EventService, IEvent} from '../../services/event.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-workspace-header',
  templateUrl: './workspace-header@conv.component.html',
  styleUrls: ['./workspace-header@conv.component.scss']
})
export class WorkspaceHeaderComponent implements OnDestroy, OnInit {
  userModel: UserInfoModel;
  notificationCounter = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private eventService: EventService,
              private sideBarManager: SideBarManager,
              private storageService: LocalStorageService) {
    this.eventService
        .events$
        .pipe(
          filter(value => !!value),
          takeUntil(this.unsubscribe$)
        ).subscribe((events: IEvent[]) => this.notificationCounter = events.length);
  }

  ngOnInit(): void {
    this.route.data
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          const userModel = data['orgInfo'];
          if (userModel) {


            this.userModel = userModel;
            this.storageService.saveUserModel(userModel);
          }
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout();
  }

  notification() {
    this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.SWITCH});
  }
}
