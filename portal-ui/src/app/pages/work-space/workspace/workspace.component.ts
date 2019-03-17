import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {LayersService} from '../../../services/geoserver/layers.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {CommunicationService} from '../../../services/communication.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {WebsocketService} from '../../../services/websocket.service';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  notificationCounter = 0;

  disabled = true;
  private stompClient = null;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService,
              private tokenStorageService: TokenStorageService,
              private openLayersService: OpenLayersService,
              private layersService: LayersService,
              private websocketService: WebsocketService,
              private communicationService: CommunicationService,
              private logger: NGXLogger) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.connect();

    // this.websocketService.status
    //   .pipe(
    //     tap(console.log)
    //   )
    //   .subscribe(value => {
    //     this.logger.info('this.websocketService.status: ', value);
    //   });
    //
    // this.websocketService.send(WS.SEND.SOME_EVENT1, 'My Message Text1');
    // this.websocketService.send(WS.SEND.SOME_EVENT1, 'My Message Text2');
    // this.websocketService.send(WS.SEND.SOME_EVENT1, 'My Message Text3');
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
    this.communicationService.gmlDialog.emit(copyOfLayers);
  }

  notification() {
    this.notificationCounter++;
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.logger.info('AppComponent ');
    }
  }

  connect() {
    this.logger.info('CONNECT');

    const socket = new SockJS('http://localhost:8088/crg-ws-endpoint?access_token='
      + this.tokenStorageService.getAccessToken());
    // socket.onmessage = function (data) {
    //   console.log('++++++++++sdfasdfasdf--------------- ', data);
    // };

    console.log('Access Token: ', this.tokenStorageService.getAccessToken());
    // @ts-ignore
    this.stompClient = Stomp.over(socket);

    const headers = {
      Authorization: 'Bearer ' + this.tokenStorageService.getAccessToken()
    };

    const _this = this;
    this.stompClient.connect(headers, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/**', function (data) {
        console.log(' ++++++++++++++++++++++++++++ asdf: ', JSON.parse(data.body));
      });
    });
  }

}
