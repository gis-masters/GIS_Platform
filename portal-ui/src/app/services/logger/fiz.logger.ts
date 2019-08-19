import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {LocalStorageService} from '../local-storage.service';

export interface LogModel {
  mode: LogMode;
  logItems: LogItem[];
  defaultLevel: LogLevel;
}

export interface LogItem {
  key: string;
  types: LogType[];

}

export interface LogType {
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

@Injectable({providedIn: 'root'})
export class FizLogger {

  private logModel: LogModel;

  constructor(private storageService: LocalStorageService) {
    const logModel = this.storageService.getLogModel();

    if (!logModel) {
      this.updateLogModel({
        mode: LogMode.DEV,
        logItems: [],
        defaultLevel: LogLevel.INFO
      });
    } else {
      this.logModel = logModel;
      console.log('Log mod: ', logModel.mode);
    }
  }

  debug(key: string, msg: string, object?: any): string | undefined {
    return this.base(LogLevel.DEBUG, key, msg, object);
  }

  info(key: string, msg: string, object?: any): string | undefined {
    return this.base(LogLevel.INFO, key, msg, object);
  }

  warn(key: string, msg: string, object?: any): string | undefined {
    return this.base(LogLevel.WARN, key, msg, object);
  }

  error(key: string, msg: string, object?: any): string | undefined {
    return this.base(LogLevel.ERROR, key, msg, object);
  }

  private base(logLevel: LogLevel, key: string, msg: string, object?: any): string | undefined {
    if (this.keyNotExist(key)) {
      this.addNewKey(key);
    }

    const definedLevel = this.getItemLevel(key);
    if (definedLevel) {
      if (logLevel >= definedLevel) {
        if (object) {
          console.log(new Date().toISOString() + ' ' + this.print(logLevel) + ' ' + msg, object);
        } else {
          console.log(new Date().toISOString() + ' ' + this.print(logLevel) + ' ' + msg);
        }

        return msg;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  getLogModel(): LogModel {
    return this.logModel;
  }

  /**
   * Вщзвращает уровень лога для данного ключа.
   * @param searchKey Если настройки по ключу не нйдены или ключ есть но не заданы параметры для
   * конкретного режима вернет undefined.
   */
  private getItemLevel(searchKey: string): LogLevel | undefined {
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

  /**
   * Если в модели нет ключа то мы его создаем с дефолтным значением определенным в модели.
   *
   * @param key Искомы ключ
   */
  private addNewKey(key: string): void {
    const mode = this.logModel.mode;
    const _types = [];

    if (mode === LogMode.DEV) {
      _types.push({
        mod: LogMode.DEV,
        level: this.logModel.defaultLevel
      });
    } else if (mode === LogMode.PROD) {
      _types.push({
        mod: LogMode.PROD,
        level: this.logModel.defaultLevel
      });
    } else {
      console.log('Unsupported logMode');
    }

    this.logModel.logItems.push({
      key: key,
      types: _types
    });

    this.updateLogModel(this.logModel);
  }

  private keyNotExist(key: string) {
    return !this.logModel.logItems.find((logItem: LogItem) => logItem.key === key);
  }

  private updateLogModel(logModel: LogModel) {
    this.logModel = logModel;
    this.storageService.setLogModel(logModel);
  }

  private print(logLevel: LogLevel): string {
    switch (logLevel) {
      case LogLevel.DEBUG: return 'DEBUG';
      case LogLevel.INFO: return 'INFO';
      case LogLevel.WARN: return 'WARN';
      case LogLevel.ERROR: return 'ERROR';
      default: return 'unknow level';
    }
  }
}
