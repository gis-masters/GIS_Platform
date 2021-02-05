import { BehaviorSubject, Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

import { generateRandomId } from './util/randomId';
import { BugObject } from './crg/validation.service';
import { getWsEndpointUrl } from './server-urls.service';
import { ProcessType } from './models';

export interface IWsMessage<T = ExportWsMsg | ValidationWsMsg> {
  type: ProcessType;
  payload: T;
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

  messages$: Observable<IWsMessage> = this._wsMsg$.asObservable().pipe(
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
    const socket = new SockJS(await getWsEndpointUrl());

    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.setConnected(true);
      this.stompClient.subscribe('/topic/' + this.id + '/**', data => {
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

window['ws'] = wsService;
