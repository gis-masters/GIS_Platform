import { remove } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, publishReplay, refCount } from 'rxjs/operators';

import { communicationService } from './communication.service';
import { ProcessType, WsImportModel } from './data/processes/processes.models';
import { Role } from './permissions/permissions.models';
import { generateRandomId } from './util/randomId';
import { IWsMessage, wsService } from './ws.service';

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
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private EVENTS_KEY = 'events';

  private _events$: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>([]);
  events$: Observable<IEvent[]> = this._events$.asObservable().pipe(
    // компоненты при подписке должны видеть одно последнее значение в потоке
    publishReplay(1),
    refCount()
  );

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
   * Обновляем события во всех нужных местах :)
   */
  update(events: IEvent[]) {
    this._events$.next(events);
    this.saveToLocalStorage(events);
  }

  private constructor() {
    const savedEvents: IEvent[] | undefined = this.getFromLocalStorage();
    if (savedEvents && savedEvents.length > 0) {
      this._events$.next(savedEvents);
    }

    // Не буду тут заморачиваться с отписками потому как этот сервис живет постоянно
    wsService.messages$
      .pipe(
        filter(value => !!value),
        filter((msg: IWsMessage | undefined) => this.isAllowedMessageType(msg))
      )
      .subscribe((wsMessage: IWsMessage | undefined) => this.handleMessage(wsMessage));
  }

  private isAllowedMessageType(msg?: IWsMessage): boolean {
    return !!(
      msg?.type === 'EXPORT' ||
      msg?.type === 'VALIDATION_REPORT' ||
      msg?.type === 'IMPORT_GML' ||
      msg?.type === 'IMPORT_DXF' ||
      msg?.type === 'IMPORT_TAB' ||
      msg?.type === 'IMPORT_MID' ||
      msg?.type === 'IMPORT_SHP' ||
      msg?.type === 'IMPORT_TIF'
    );
  }

  /**
   * Обрабатываем сообщение. (добавляем в общий список, персистим в локал сторадж)
   * @param wsMessage Сообщение от сервера
   */
  private handleMessage(wsMessage?: IWsMessage) {
    if (!wsMessage) {
      return;
    }
    const newEvent: IEvent = { id: generateRandomId(), payload: wsMessage, type: wsMessage.type };
    const events = this._events$.getValue();

    const sameEvent = this.findSameEvent(wsMessage, events);
    if (sameEvent === undefined) {
      events.push(newEvent);
    } else {
      sameEvent.payload = newEvent.payload;
    }

    this.update(events);
    this.analyzeEvents(events);
  }

  private findSameEvent(wsMessage: IWsMessage, events: IEvent[]) {
    return events.find((event: IEvent) => {
      return event.payload.payload.id === wsMessage.payload.id;
    });
  }

  private saveToLocalStorage(events: IEvent[]): void {
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
  }

  private getFromLocalStorage(): IEvent[] | undefined {
    const events = localStorage.getItem(this.EVENTS_KEY);

    if (typeof events === 'string') {
      try {
        return JSON.parse(events) as IEvent[];
      } catch {
        this.update([]);
      }
    }
  }

  private analyzeEvents(events: IEvent[]) {
    events.forEach(event => {
      const { type, payload } = event.payload;
      if (
        (type === 'IMPORT_GML' ||
          type === 'IMPORT_DXF' ||
          type === 'IMPORT_TAB' ||
          type === 'IMPORT_MID' ||
          type === 'IMPORT_SHP' ||
          type === 'IMPORT_TIF') &&
        (payload.status === 'DONE' || payload.status === 'ERROR')
      ) {
        const importGml = payload as WsImportModel;
        if (importGml.payload.projectIsNew) {
          communicationService.projectUpdated.emit({
            type: 'create',
            data: {
              id: importGml.payload.projectId,
              name: importGml.payload.projectName,
              folder: false,
              role: Role.OWNER
            }
          });
        }
      }
    });
  }
}

export const eventService = EventService.instance;
