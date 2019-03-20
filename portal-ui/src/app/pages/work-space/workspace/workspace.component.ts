import {NGXLogger} from 'ngx-logger';
import {filter} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {EventService, IEvent} from '../../../services/event.service';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {LayersService} from '../../../services/geoserver/layers.service';
import {ActionType, CommunicationService} from '../../../services/communication.service';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  notificationCounter = 0;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private eventService: EventService,
              private layersService: LayersService,
              private communicationService: CommunicationService,
              private logger: NGXLogger) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.eventService.events$
        .pipe(filter(value => !!value))
        .subscribe((events: IEvent[]) => this.notificationCounter = events.length);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
  }

  openBugReportSidebar() {
    this.communicationService.bugReportSidebar.emit(true);
  }

  openExportDialog() {
    const copyOfLayers = Object.assign([], this.layersService.getCurrent());
    this.communicationService.gmlDialog.emit({open: true, layers: copyOfLayers});
  }

  notification() {
    this.communicationService.infoSidebar.emit(ActionType.SWITCH);
  }

}
