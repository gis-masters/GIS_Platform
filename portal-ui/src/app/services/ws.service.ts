import { CompatClient, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import SockJS from 'sockjs-client';

import { getWsEndpointUrl } from './api/server-urls.service';
import { ProcessType, WsImportModel } from './data/processes/processes.models';
import { BugObject } from './data/validation/validation.models';
import { generateRandomId } from './util/randomId';

export interface IWsMessage<T = ExportWsMsg | ValidationWsMsg | WsImportModel> {
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
  payload: string;
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
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private _wsMsg$: BehaviorSubject<IWsMessage | undefined> = new BehaviorSubject<IWsMessage | undefined>(undefined);

  messages$: Observable<IWsMessage | undefined> = this._wsMsg$.asObservable().pipe(
    // компоненты при подписке должны видеть одно последнее значение в потоке
    publishReplay(1),
    refCount()
  );

  disabled = true;

  private id = generateRandomId();
  private stompClient?: CompatClient;

  private constructor() {
    this.connect();
  }

  private connect() {
    const socket = new SockJS(getWsEndpointUrl());

    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.setConnected(true);
      this.stompClient?.subscribe('/topic/' + this.id + '/**', data => {
        this._wsMsg$.next(JSON.parse(data.body) as IWsMessage<ExportWsMsg | ValidationWsMsg | WsImportModel>);
      });
    });
  }

  private setConnected(connected: boolean) {
    this.disabled = !connected;
  }

  getId(): string {
    return this.id;
  }
}

export const wsService = WsService.instance;
