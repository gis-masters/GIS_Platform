import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {CommunicationService} from './communication.service';

/**
 * Сервис с логикой показа всплывающих окон
 */
@Injectable({
  providedIn: 'root'
})
export class SideBarManager {

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService) {
  }

  do(sidebarAction: SidebarAction) {
    if (sidebarAction.target === SidebarType.LAYERS) {
      return;
    }

    if (sidebarAction.target === SidebarType.INFO) {
      this.emit(SidebarType.INFO, sidebarAction.action);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
      this.emit(SidebarType.FEATURES, ActionType.CLOSE);
    } else if (sidebarAction.target === SidebarType.BUG_REPORT) {
      this.emit(SidebarType.BUG_REPORT, sidebarAction.action);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
      this.emit(SidebarType.FEATURES, ActionType.CLOSE);
      this.emit(SidebarType.ATTRIBUTES, ActionType.CLOSE);
    } else if (sidebarAction.target === SidebarType.FEATURES) {
      this.emit(SidebarType.FEATURES, sidebarAction.action);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
      this.emit(SidebarType.ATTRIBUTES, ActionType.CLOSE);
    } else if (sidebarAction.target === SidebarType.ATTRIBUTES) {
      this.emit(SidebarType.ATTRIBUTES, sidebarAction.action, sidebarAction.data);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
    } else {
      this.logger.warn('Not supported sidebar type: ', sidebarAction.target);
    }
  }

  closeAll() {
    this.emit(SidebarType.INFO, ActionType.CLOSE);
    this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
  }

  private emit(target: SidebarType, action: ActionType, data?: any) {
    this.communicationService.sidebarManager
        .emit({target: target, action: action, data: data});
  }
}

export interface SidebarAction {
  // TODO: rename properties: 'action' to 'type' maybe
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
