import {NGXLogger} from 'ngx-logger';
import {filter} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {EventService, IEvent} from '../../../services/event.service';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {LayersService} from '../../../services/geoserver/layers.service';
import {ActionType, CommunicationService, SidebarData, SidebarType} from '../../../services/communication.service';

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
  isBugReportSidebarActive = false;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private eventService: EventService,
              private layersService: LayersService,
              private communicationService: CommunicationService,
              private logger: NGXLogger) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.eventService.events$
        .pipe(filter(value => !!value))
        .subscribe((events: IEvent[]) => this.notificationCounter = events.length);

    this.communicationService
        .sidebarManager$()
        .subscribe((data: SidebarData) => this.manageSidebar(data));
  }

  private manageSidebar(data: SidebarData) {
    if (data.target === SidebarType.LAYERS) {
      return;
    }

    if (data.target === SidebarType.INFO) {
      switch (data.action) {
        case ActionType.CLOSE: this.isInfoSidebarActive = false; break;
        case ActionType.OPEN: this.isInfoSidebarActive = true;  break;
        case ActionType.SWITCH: this.isInfoSidebarActive = !this.isInfoSidebarActive; break;
        default:
          this.logger.warn('Unsupported action type: ', data.action);
      }

      if (this.isInfoSidebarActive) {
        this.isBugReportSidebarActive = false;
      }
    } else if (data.target === SidebarType.BUG_REPORT) {
      switch (data.action) {
        case ActionType.CLOSE: this.isBugReportSidebarActive = false; break;
        case ActionType.OPEN: this.isBugReportSidebarActive = true;  break;
        case ActionType.SWITCH: this.isBugReportSidebarActive = !this.isBugReportSidebarActive; break;
        default:
          this.logger.warn('Unsupported action type: ', data.action);
      }

      if (this.isBugReportSidebarActive) {
        this.isInfoSidebarActive = false;
      }
    } else {
      this.logger.warn('Not supported sidebar type: ', data.target);
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
  }

  openBugReportSidebar() {
    this.communicationService.sidebarManager.emit({action: ActionType.SWITCH, target: SidebarType.BUG_REPORT});
  }

  openExportDialog() {
    const copyOfLayers = Object.assign([], this.layersService.getCurrent());
    this.communicationService.gmlDialog.emit({action: ActionType.OPEN, layers: copyOfLayers});
  }

  notification() {
    this.communicationService.sidebarManager.emit({action: ActionType.SWITCH, target: SidebarType.INFO});
  }

}
