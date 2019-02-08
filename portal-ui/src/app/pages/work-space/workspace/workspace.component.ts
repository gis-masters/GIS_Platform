import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from "../../../services/auth.service";
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {CommunicationService} from "../../../services/communication.service";
import {OpenLayersService} from "../../../services/open-layer/open-layers.service";

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private openLayersService: OpenLayersService,
              private communicationService: CommunicationService,
              private logger: NGXLogger) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
  }

  openLayersObjectView() {
    this.communicationService.openLayerObjectsWindow();
  }

  tryPositionToObject() {
    this.logger.info(' +++ ');

    this.openLayersService.zoomIn();
  }
}
