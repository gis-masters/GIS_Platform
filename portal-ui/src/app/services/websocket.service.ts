// import {Injectable, OnDestroy} from '@angular/core';
// import {WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';
// import {interval, Observable, Observer, Subject, SubscriptionLike} from 'rxjs';
// import {distinctUntilChanged, filter, map, share, takeWhile} from 'rxjs/operators';
// import {TokenStorageService} from './token-storage.service';
// import {NGXLogger} from 'ngx-logger';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService implements IWebsocketService, OnDestroy {
//
//   private config: WebSocketSubjectConfig<IWsMessage<any>>;
//
//   private websocketSub: SubscriptionLike;
//   private statusSub: SubscriptionLike;
//
//   private reconnection$: Observable<number>;
//   private websocket$: WebSocketSubject<IWsMessage<any>>;
//   private connection$: Observer<boolean>;
//   private wsMessages$: Subject<IWsMessage<any>>;
//
//   private reconnectInterval: number;
//   private reconnectAttempts: number;
//   private isConnected: boolean;
//
//   private wsConfig: WebSocketConfig = {
//     url: 'http://localhost:8088/crg-ws-endpoint',
//     reconnectAttempts: 10,
//     reconnectInterval: 5000
//   };
//
//   public status: Observable<boolean>;
//
//   constructor(private logger: NGXLogger,
//               private tokenStorageService: TokenStorageService) {
//     this.logger.info('WebsocketService constructor');
//
//     this.wsMessages$ = new Subject<IWsMessage<any>>();
//
//     this.reconnectInterval = this.wsConfig.reconnectInterval || 5000; // pause between connections
//     this.reconnectAttempts = this.wsConfig.reconnectAttempts || 10; // number of connection attempts
//
//     this.config = {
//       url: this.wsConfig.url,
//       closeObserver: {
//         next: (event: CloseEvent) => {
//           console.log('WebSocket closeObserver');
//
//           this.websocket$ = null;
//           this.connection$.next(false);
//         }
//       },
//       openObserver: {
//         next: (event: Event) => {
//           console.log('WebSocket connected!');
//           this.connection$.next(true);
//         }
//       }
//     };
//
//     // connection status
//     this.status = new Observable<boolean>((observer) => {
//       this.connection$ = observer;
//     }).pipe(share(), distinctUntilChanged());
//
//     // run reconnect if not connection
//     this.statusSub = this.status
//         .subscribe((isConnected) => {
//           this.isConnected = isConnected;
//
//           if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
//             this.reconnect();
//           }
//         });
//
//     this.websocketSub = this.wsMessages$
//         .subscribe(null, (error: ErrorEvent) => console.error('WebSocket error!', error));
//
//     this.connect();
//   }
//
//   ngOnDestroy() {
//     this.websocketSub.unsubscribe();
//     this.statusSub.unsubscribe();
//   }
//
//
//   /*
//   * connect to WebSocked
//   * */
//   private connect(): void {
//     // const options = {
//     //   headers: {
//     //     Authorization: 'Bearer ' + this.tokenStorageService.getAccessToken()
//     //   }
//     // };
//     //
//     // const ws = new WebSocket('ws://example.com/path', options);
//     this.websocket$ = new WebSocketSubject(this.config);
//
//     this.websocket$
//         .subscribe(
//         (message) => this.wsMessages$.next(message),
//         (error: Event) => {
//           if (!this.websocket$) {
//             // run reconnect if errors
//             this.reconnect();
//           }
//         });
//   }
//
//
//   /*
//   * reconnect if not connecting or errors
//   * */
//   private reconnect(): void {
//     this.logger.info('reconnect');
//
//     this.reconnection$ = interval(this.reconnectInterval)
//         .pipe(
//           takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$)
//         );
//
//     this.reconnection$
//         .subscribe(() => this.connect(),
//         null,
//         () => {
//           // Subject complete if reconnect attemts ending
//           this.reconnection$ = null;
//
//           if (!this.websocket$) {
//             this.wsMessages$.complete();
//             this.connection$.complete();
//           }
//         });
//   }
//
//
//   /*
//   * on message event
//   * */
//   public on<T>(event: string): Observable<T> {
//     if (event) {
//       return this.wsMessages$.pipe(
//         filter((message: IWsMessage<T>) => message.event === event),
//         map((message: IWsMessage<T>) => message.data)
//       );
//     }
//   }
//
//
//   /*
//   * on message to server
//   * */
//   public send(event: string, data: any = {}): void {
//     if (this.isConnected) {
//       this.logger.warn('WS in not connecting!');
//
//       return;
//     }
//
//     if (event) {
//       this.websocket$.next(<any>JSON.stringify({event, data}));
//     } else {
//       this.logger.warn('Dont set event: ', event);
//     }
//   }
//
// }
//
// export interface IWebsocketService {
//   status: Observable<boolean>;
//
//   on<T>(event: string): Observable<T>;
//
//   send(event: string, data: any): void;
// }
//
// export interface WebSocketConfig {
//   url: string;
//   reconnectInterval?: number;
//   reconnectAttempts?: number;
// }
//
// export interface IWsMessage<T> {
//   event: string;
//   data: T;
// }
//
// export const WS = {
//   ON: {
//     MESSAGES: 'messages',
//     COUNTER: 'counter',
//     UPDATE_TEXTS: 'update-texts'
//   },
//   SEND: {
//     SOME_EVENT1: 'some-event',
//     SOME_EVENT2: 'remove-text'
//   }
// };
