import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {ServerPropertiesService} from './server-properties.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {publishReplay, refCount} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private _wsMsg$: BehaviorSubject<IWsMessage> = new BehaviorSubject<IWsMessage>(undefined);
  public messages$: Observable<IWsMessage> = this._wsMsg$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount()
    );

  disabled = true;

  private id = Math.random().toString(36).substring(2, 8);
  private stompClient = null;

  constructor(private logger: NGXLogger,
              private propertiesService: ServerPropertiesService,
              private storageService: TokenStorageService) {
    this.logger.info('id: ', this.id);

    this.connect();
  }

  connect() {
    this.logger.info('Attempt to CONNECT');

    // const socket = new SockJS(this.propertiesService.wsUrl + '?access_token=' + this.storageService.getAccessToken());
    const socket = new SockJS('http://localhost:8088/crg-ws-endpoint?access_token=' + this.storageService.getAccessToken());

    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      // console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/' + _this.id + '/**', function (data) {
        _this._wsMsg$.next(JSON.parse(data.body));
      });
    });
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.logger.info('connected');
    }
  }

  getId(): string {
    return this.id;
  }

}

export interface IWsMessage {
  type: string;
  payload: any;
}
