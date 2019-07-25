import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {StringUtil} from './util/StringUtil';
import {BehaviorSubject, Observable} from 'rxjs';
import {BugObject} from './crg/validation.service';
import {publishReplay, refCount} from 'rxjs/operators';
import {TokenStorageService} from './token-storage.service';
import {ServerPropertiesService} from './server-properties.service';

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

  private id = StringUtil.generateRandomId();
  private stompClient = null;

  constructor(private logger: NGXLogger,
              private propertiesService: ServerPropertiesService,
              private storageService: TokenStorageService) {
    this.logger.info('id: ', this.id);

    this.connect();
  }

  connect() {
    // TODO: CORS щишибка на websocket когда конектимся через 8100, попробую здесь напрямую к 8088. Или попробывать
    // добавить корс вебсокет секьюрити и на 8100
    const socket = new SockJS(this.propertiesService.host + ':8088/crg-ws-endpoint?access_token=' + this.storageService.getAccessToken());

    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      _this.stompClient.subscribe('/topic/' + _this.id + '/**', function (data) {
        // console.log('+ - +', JSON.parse(data.body));

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
  type: WsMessageType;
  payload: ExportWsMsg | ValidationWsMsg;
}

export interface ExportWsMsg {
  id: string;
  description: string;
  pathToFile: string;
  pathToLog: string;
  status: string;
  progress: number;
}

export interface ValidationWsMsg {
  id: string;
  description: string;
  results: BugObject[];
  status: string;
  progress: number;
  total: number;
  type?: WsMessageType;
  validated: boolean;
  lastValidated: string;
  pending?: boolean;
  error?: boolean;
  done?: boolean;
  empty?: boolean;
}

// Править в соответствии с: ru/mycrg/common/enums/ProcessType.java
export enum WsMessageType {
  CREATE_ORG = 'CREATE_ORG',
  CREATE_PROJECT = 'CREATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',

  IMPORT = 'IMPORT',
  VALIDATION = 'VALIDATION',
  EXPORT = 'EXPORT'
}
