import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {FizLogger} from '../../../services/logger/fiz.logger';
import {UserInfoModel} from '../../../services/gis/users.service';
import {EventService, IEvent} from '../../../services/event.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {CommunicationService} from '../../../services/communication.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionType, SidebarData, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy, OnInit {

  notificationCounter = 0;
  isInfoSidebarActive = false;
  userModel: UserInfoModel;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private route: ActivatedRoute,
              private eventService: EventService,
              private sideBarManager: SideBarManager,
              private storageService: LocalStorageService,
              private communicationService: CommunicationService,
              private log: FizLogger) {
    this.log.debug('setUp', 'WorkspaceComponent constructor');

    this.eventService.events$
        .pipe(filter(value => !!value))
        .subscribe((events: IEvent[]) => this.notificationCounter = events.length);

    this.communicationService.sidebarManager
        .pipe(
          filter((data: SidebarData) => data.target === SidebarType.INFO),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((data: SidebarData) => {
          switch (data.action) {
            case ActionType.CLOSE: this.isInfoSidebarActive = false; break;
            case ActionType.OPEN: this.isInfoSidebarActive = true;  break;
            case ActionType.SWITCH: this.isInfoSidebarActive = !this.isInfoSidebarActive; break;
            default:
              this.log.warn('infoSidebar', 'Unsupported action type: ', data.action);
          }
        });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const userModel = data['orgInfo'];
      if (userModel) {
        this.log.info('organization', 'userModel = ', userModel);

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
    this.sideBarManager.do(SidebarType.INFO, ActionType.SWITCH);
  }

}
