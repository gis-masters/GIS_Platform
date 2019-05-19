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

  do(target: SidebarType, action: ActionType) {
    if (target === SidebarType.LAYERS) {
      return;
    }

    if (target === SidebarType.INFO) {
      this.emit(SidebarType.INFO, action);
      this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
    } else if (target === SidebarType.BUG_REPORT) {
      this.emit(SidebarType.BUG_REPORT, action);
      this.emit(SidebarType.INFO, ActionType.CLOSE);
    } else {
      this.logger.warn('Not supported sidebar type: ', target);
    }
  }

  closeAll() {
    this.emit(SidebarType.INFO, ActionType.CLOSE);
    this.emit(SidebarType.BUG_REPORT, ActionType.CLOSE);
  }

  private emit(target: SidebarType, action: ActionType) {
    this.communicationService
        .sidebarManager$()
        .emit({target: target, action: action});
  }
}

export interface SidebarData {
  action: ActionType;
  target: SidebarType;
}

export enum ActionType {
  OPEN,
  CLOSE,
  CLOSE_ALL,
  SWITCH
}

export enum SidebarType {
  INFO,       // Информационная панель
  LAYERS,     // Левая панель со слоями
  BUG_REPORT, // Панель отображения и редактирования ошибок
}
