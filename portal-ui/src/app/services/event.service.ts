import { BehaviorSubject, Observable } from 'rxjs';
import { filter, publishReplay, refCount } from 'rxjs/operators';
import { remove } from 'lodash';

import { ProcessType } from './models';
import { generateRandomId } from './util/randomId';
import { IWsMessage, wsService } from './ws.service';
import { WsImportGmlModel } from './crg/processes.service';
import { communicationService } from './communication.service';

// Пока события будут завязаны на IWsMessage
export interface IEvent {
  id: string;
  type: ProcessType;
  payload: IWsMessage;
}

/**
 * Сервис обработки и хранения событий.
 * Возникающие события удаляется из списка пользователем.
 */
class EventService {
  private static _instance: EventService;

  private EVENTS_KEY = 'events';

  private _events$: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>([]);
  public events$: Observable<IEvent[]> = this._events$.asObservable().pipe(
    // компоненты при подписке должны видеть одно последнее значение в потоке
    publishReplay(1),
    refCount()
  );

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    const savedEvents: IEvent[] = this.getFromLocalStorage();
    if (savedEvents && savedEvents.length > 0) {
      this._events$.next(savedEvents);
    }

    // Не буду тут заморачиваться с отписками потому как этот сервис живет постоянно
    wsService.messages$
      .pipe(
        filter(value => !!value),
        filter((msg: IWsMessage) => this.isAllowedMessageType(msg))
      )
      .subscribe((wsMessage: IWsMessage) => this.handleMessage(wsMessage));
  }

  // Пока только EXPORT и VALIDATION_REPORT
  private isAllowedMessageType(msg: IWsMessage) {
    if (msg.type === 'EXPORT') {
      return msg.type === ProcessType.EXPORT;
    } else if (msg.type === 'VALIDATION_REPORT') {
      return msg.type === ProcessType.VALIDATION_REPORT;
    } else if (msg.type === 'IMPORT_GML') {
      return msg.type === ProcessType.IMPORT_GML;
    }
  }

  /**
   * Delete event by Id
   * @param id Event Id
   */
  delete(id: string) {
    const events = this._events$.getValue();
    remove(events, (event: IEvent) => event.id === id);

    this.update(events);
  }

  /**
   * Обрабатываем сообщение. (добавляем в общий список, персистим в локал сторадж)
   * @param wsMessage Сообщение от сервера
   */
  private handleMessage(wsMessage: IWsMessage) {
    const newEvent: IEvent = { id: generateRandomId(), payload: wsMessage, type: wsMessage.type };
    const events = this._events$.getValue();

    const sameEvent = this.findSameEvent(wsMessage, events);
    if (sameEvent !== undefined) {
      sameEvent.payload = newEvent.payload;
    } else {
      events.push(newEvent);
    }

    this.update(events);
    this.analyzeEvents(events);
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
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
  }

  private getFromLocalStorage(): IEvent[] {
    const events = localStorage.getItem(this.EVENTS_KEY);

    return JSON.parse(events) as IEvent[];
  }

  private analyzeEvents(events: IEvent[]) {
    events.forEach(event => {
      const { type, payload } = event.payload;
      if (type === 'IMPORT_GML' && (payload.status === 'DONE' || payload.status === 'ERROR')) {
        const importGml = payload as WsImportGmlModel;
        if (importGml.payload.projectIsNew) {
          communicationService.projectsUpdated.emit();
        }
      }
    });
  }
}

export const eventService = EventService.instance;
