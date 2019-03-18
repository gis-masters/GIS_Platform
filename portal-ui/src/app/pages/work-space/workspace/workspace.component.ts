import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {LayersService} from '../../../services/geoserver/layers.service';
import {CommunicationService} from '../../../services/communication.service';
import {IWsMessage, WsService} from '../../../services/ws.service';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  notificationCounter = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private wsService: WsService,
              private layersService: LayersService,
              private communicationService: CommunicationService,
              private logger: NGXLogger) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.wsService.messages$
        .pipe(
          filter(value => !!value),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((wsMessage: IWsMessage) => {
          this.logger.info('this.wsService.messages$: ', wsMessage);

          this.notificationCounter++;
        });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout();
  }

  openBugReportSidebar() {
    this.communicationService.bugReportSidebar.emit(true);
  }

  openExportDialog() {
    const copyOfLayers = Object.assign([], this.layersService.getCurrent());
    this.communicationService.gmlDialog.emit(copyOfLayers);
  }

  notification() {
    // this.notificationCounter++;
  }

}
