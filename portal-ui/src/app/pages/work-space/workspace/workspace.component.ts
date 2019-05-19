import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {filter, takeUntil} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {EventService, IEvent} from '../../../services/event.service';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {LayersService} from '../../../services/geoserver/layers.service';
import {CommunicationService} from '../../../services/communication.service';
import {ActionType, SidebarData, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  notificationCounter = 0;
  isInfoSidebarActive = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private eventService: EventService,
              private layersService: LayersService,
              private sideBarManager: SideBarManager,
              private communicationService: CommunicationService,
              private logger: NGXLogger) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

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
              this.logger.warn('Unsupported action type: ', data.action);
          }
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
  }

  notification() {
    this.sideBarManager.do(SidebarType.INFO, ActionType.SWITCH);
  }

}
