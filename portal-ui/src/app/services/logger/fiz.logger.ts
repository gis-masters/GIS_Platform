import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {LocalStorageService} from '../local-storage.service';

@Injectable({providedIn: 'root'})
export class FizLogger {

  private logModel: LogModel;

  constructor(private storageService: LocalStorageService) {
    const logModel = this.storageService.getLogModel();
    if (!logModel) {
      this.logModel = {
        mode: LogMode.DEV,
        logItems: [
          {
            key: 'MapComponent.constructor',
            types: [
              {
                mod: LogMode.DEV,
                level: LogLevel.DEBUG
              },
              {
                mod: LogMode.PROD,
                level: LogLevel.DEBUG
              },
            ]
          },
          {
            key: 'featuresSidebar',
            types: [
              {
                mod: LogMode.DEV,
                level: LogLevel.DEBUG
              },
            ]
          }
        ]
      };

      this.storageService.setLogModel(this.logModel);
    } else {
      this.logModel = logModel;
      console.log('Log mod: ', logModel.mode);
    }
  }

  info(key: string, msg: string) {
    const definedLevel = this.findLevelByKeyAndMode(key);
    if (definedLevel) {
      if (LogLevel.INFO >= definedLevel) {
        console.log(new Date().toISOString() + ' INFO ' + msg);

        // Делаю return для простоты тестирования
        return msg;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  info_(key: string, msg: string, object: any) {

  }

  debug(key: string, msg: string, object: any) {
    const logModel: LogModel = this.storageService.getLogModel();

    // this.logger.info();
  }

  getLogModel(): LogModel {
    return this.logModel;
  }

  setLogModel(logModel: LogModel) {
    this.logModel = logModel;
  }

  /**
   * Исходя из уровня лога и ключа, получаем настроенный уровень лога.
   * @param searchKey Если настройки по ключу не нйдены или ключ есть но не заданы параметры для
   * конкретного режима верну undefined.
   */
  private findLevelByKeyAndMode(searchKey: string): LogLevel | undefined {
    const logItem: LogItem = _.findLast(this.logModel.logItems, ['key', searchKey]);
    if (logItem) {
      const logType: LogType = _.findLast(logItem.types, ['mod', this.logModel.mode]);
      if (logType) {
        return logType.level;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

}

export interface LogModel {
  mode: LogMode;
  logItems: LogItem[];
}

export interface LogItem {
  key: string;
  types: LogType[];

}

interface LogType {
  mod: LogMode;
  level: LogLevel;
}

export enum LogLevel {
  DEBUG = '100',
  INFO = '200',
  WARN = '300',
  ERROR = '400',
}

export enum LogMode {
  DEV = 'DEV',
  PROD = 'PROD',
}
