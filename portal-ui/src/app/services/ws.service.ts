import { BehaviorSubject, Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

import { generateRandomId } from './util/stringUtil';
import { BugObject } from './crg/validation.service';
import { tokenStorageService } from './token-storage.service';
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

class WsService {
  private static _instance: WsService;
  private _wsMsg$: BehaviorSubject<IWsMessage> = new BehaviorSubject<IWsMessage>(undefined);

  messages$: Observable<IWsMessage> = this._wsMsg$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount()
    );

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  disabled = true;

  private id = generateRandomId();
  private stompClient: CompatClient;

  private constructor() {
    this.connect();
  }

  async connect() {
    // TODO: CORS щишибка на websocket когда конектимся через 8100, попробую здесь напрямую к 8088. Или попробывать
    // добавить корс вебсокет секьюрити и на 8100
    const host = await serverProperties.host;
    const port = await serverProperties.wsPort;
    const socket = new SockJS(`${host}:${port}/crg-ws-endpoint?access_token=${tokenStorageService.getAccessToken()}`);

    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.setConnected(true);
      this.stompClient.subscribe('/topic/' + this.id + '/**', (data) => {
        this._wsMsg$.next(JSON.parse(data.body));
      });
    });
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
  }

  getId(): string {
    return this.id;
  }
}

export const wsService = WsService.instance;
