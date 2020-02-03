import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { NGXLogger } from 'ngx-logger';

import { generateRandomId } from './util/stringUtil';
import { BugObject } from './crg/validation.service';
import { TokenStorageService } from './token-storage.service';
import { serverProperties } from './server-properties.service';
import { ProcessType } from './crg/models';

export interface IWsMessage {
  type: ProcessType;
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
  type?: ProcessType;
  validated: boolean;
  lastValidated: string;
  pending?: boolean;
  error?: boolean;
  done?: boolean;
  empty?: boolean;
}

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

  private id = generateRandomId();
  private stompClient: CompatClient;

  constructor(private logger: NGXLogger,
              private storageService: TokenStorageService) {
    this.logger.info('id: ', this.id);

    this.connect();
  }

  async connect() {
    // TODO: CORS щишибка на websocket когда конектимся через 8100, попробую здесь напрямую к 8088. Или попробывать
    // добавить корс вебсокет секьюрити и на 8100
    const host = await serverProperties.host;
    const wsPort = await serverProperties.wsPort;
    const socket = new SockJS(host + ':' + wsPort + '/crg-ws-endpoint?access_token=' + this.storageService.getAccessToken());

    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function () {
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
