import { BehaviorSubject } from 'rxjs';

import { services } from './services';
import { communicationService } from './communication.service';

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

type CurrentState = { [key: string]: ActionType };

/**
 * Сервис с логикой показа всплывающих окон
 */
class SideBarManager {
  private static _instance: SideBarManager;

  currentState$: BehaviorSubject<CurrentState> = new BehaviorSubject<CurrentState>({
    'INFO': ActionType.CLOSE,
    'LAYERS': ActionType.CLOSE,
    'FEATURES': ActionType.CLOSE,
    'BUG_REPORT': ActionType.CLOSE,
    'ATTRIBUTES': ActionType.CLOSE,
  });

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  constructor() { }

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
      services.logger.warn('Not supported sidebar type: ', sidebar.target);
    }
  }

  closeAll() {
    this.emit(SidebarType.INFO, ActionType.CLOSE);
    this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
    this.emit(SidebarType.ATTRIBUTES, ActionType.CLOSE);
    this.emit(SidebarType.FEATURES, ActionType.CLOSE);
  }

  private emit(target: SidebarType, action: ActionType, data?: any) {
    communicationService.sidebarManager
        .emit({target: target, action: action, data: data});
  }
}

export const sideBarManager = SideBarManager.instance;
