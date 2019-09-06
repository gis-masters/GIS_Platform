import * as _ from 'lodash';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {StringUtil} from './util/StringUtil';
import {BehaviorSubject, Observable} from 'rxjs';
import {LocalStorageService} from './local-storage.service';
import {filter, publishReplay, refCount} from 'rxjs/operators';
import {IWsMessage, WsService} from './ws.service';
import {ProcessType} from './crg/models';

/**
 * Сервис обработки и хранения событий.
 * Возникающие события удаляется из списка пользователем.
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {

  private EVENTS_KEY = 'events';

  private _events$: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>([]);
  public events$: Observable<IEvent[]> = this._events$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount()
    );

  constructor(private logger: NGXLogger,
              private wsService: WsService,
              private storageService: LocalStorageService) {
    const savedEvents: IEvent[] = this.getFromLocalStorage();
    if (savedEvents && savedEvents.length > 0) {
      this._events$.next(savedEvents);
    }

    // Не буду тут заморачиваться с отписками потому как этот сервис живет постоянно
    this.wsService.messages$
        .pipe(
          filter(value => !!value),
          filter((msg: IWsMessage) => this.isAllowedMessageType(msg)),
        )
        .subscribe((wsMessage: IWsMessage) => this.handleMessage(wsMessage));
  }

  // Пока только експорт
  private isAllowedMessageType(msg: IWsMessage) {
    return msg.type === ProcessType.EXPORT;
  }

  /**
   * Delete event by Id
   * @param id Event Id
   */
  delete(id: string) {
    const events = this._events$.getValue();
    _.remove(events, (event: IEvent) => event.id === id);

    this.update(events);
  }

  /**
   * Обрабатываем сообщение. (добавляем в общий список, персистим в локал сторадж)
   * @param wsMessage Сообщение от сервера
   */
  private handleMessage(wsMessage: IWsMessage) {
    const newEvent: IEvent = {id: StringUtil.generateRandomId(), payload: wsMessage, type: wsMessage.type};
    const events = this._events$.getValue();

    const sameEvent = this.findSameEvent(wsMessage, events);
    if (sameEvent !== undefined) {
      sameEvent.payload = newEvent.payload;
    } else {
      events.push(newEvent);
    }

    this.update(events);
  }

  /**
   * Обновляем события во всех нужных местах :)
   */
  private update(events: IEvent[]) {
    this._events$.next(events);
    this.saveToLocalStorage(events);
  }

  private findSameEvent(wsMessage: IWsMessage, events: IEvent[]) {
    return events.find((event: IEvent) => {
      return event.payload.payload.id === wsMessage.payload.id;
    });
  }

  private saveToLocalStorage(events: IEvent[]): void {
    this.storageService.saveByKey(this.EVENTS_KEY, JSON.stringify(events));
  }

  private getFromLocalStorage(): IEvent[] {
    const events = localStorage.getItem(this.EVENTS_KEY);

    return JSON.parse(events);
  }

}

// Пока события будут завязаны на IWsMessage
export interface IEvent {
  id: string;
  type: ProcessType;
  payload: IWsMessage;
}
