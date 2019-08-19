import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {CommunicationService} from './communication.service';
import {BehaviorSubject} from 'rxjs';

export interface Sidebar {
  action: ActionType;
  target: SidebarType;
  data?: any;
}

export enum ActionType {
  OPEN,
  CLOSE,
  SWITCH
}

export enum SidebarType {
  INFO = 'INFO',            // Информационная панель
  LAYERS = 'LAYERS',        // Левая панель со слоями
  FEATURES = 'FEATURES',    // Панель отображения выделенных фич
  BUG_REPORT = 'BUG_REPORT',  // Панель отображения и редактирования ошибок
  ATTRIBUTES = 'ATTRIBUTES',  // Панель отображения атрибутов фичи(слоя)
}

/**
 * Сервис с логикой показа всплывающих окон
 */
@Injectable({
  providedIn: 'root'
})
export class SideBarManager {

  currentState$: BehaviorSubject<{}> = new BehaviorSubject<{}>({
    'INFO': ActionType.CLOSE,
    'LAYERS': ActionType.CLOSE,
    'FEATURES': ActionType.CLOSE,
    'BUG_REPORT': ActionType.CLOSE,
    'ATTRIBUTES': ActionType.CLOSE,
  });

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService) {
  }

  do(sidebar: Sidebar) {
    if (sidebar.target === SidebarType.LAYERS) {
      return;
    }

    if (sidebar.target === SidebarType.INFO) {
      this.emit(SidebarType.INFO, sidebar.action, sidebar.data);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
      this.emit(SidebarType.FEATURES, ActionType.CLOSE);
    } else if (sidebar.target === SidebarType.BUG_REPORT) {
      this.emit(SidebarType.BUG_REPORT, sidebar.action, sidebar.data);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
      this.emit(SidebarType.FEATURES, ActionType.CLOSE);
      this.emit(SidebarType.ATTRIBUTES, ActionType.CLOSE);
    } else if (sidebar.target === SidebarType.FEATURES) {
      this.emit(SidebarType.FEATURES, sidebar.action, sidebar.data);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
      // this.emit(SidebarType.ATTRIBUTES, ActionType.CLOSE);
    } else if (sidebar.target === SidebarType.ATTRIBUTES) {
      const currentState = this.currentState$.getValue();
      currentState[SidebarType.ATTRIBUTES] = sidebar.action;
      currentState[SidebarType.INFO] = ActionType.CLOSE;
      currentState[SidebarType.BUG_REPORT] = ActionType.CLOSE;
      this.currentState$.next(currentState);

      // TODO: переделать
      this.emit(SidebarType.ATTRIBUTES, sidebar.action, sidebar.data);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
    } else {
      this.logger.warn('Not supported sidebar type: ', sidebar.target);
    }
  }

  closeAll() {
    this.emit(SidebarType.INFO, ActionType.CLOSE);
    this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
    this.emit(SidebarType.ATTRIBUTES, ActionType.CLOSE);
    this.emit(SidebarType.FEATURES, ActionType.CLOSE);
  }

  private emit(target: SidebarType, action: ActionType, data?: any) {
    this.communicationService.sidebarManager
        .emit({target: target, action: action, data: data});
  }
}
