import {TestBed} from '@angular/core/testing';
import {FizLogger, LogItem, LogLevel, LogMode, LogType} from './fiz.logger';

describe('FizLogger test', () => {

  let fizLogger: FizLogger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [FizLogger]
    });

    fizLogger = TestBed.get(FizLogger);
  });

  it('should be created with default settings', () => {
    expect(fizLogger).toBeTruthy();
    expect(fizLogger.getLogModel()).toBeTruthy();
    expect(fizLogger.getLogModel().defaultLevel).toEqual(LogLevel.INFO);
  });

  it('should setUp keys and print INFO log (because default log is INFO)', () => {
    expect(fizLogger.info('mapKey', 'test')).toEqual('test');
    expect(fizLogger.info('notExistKey', 'some')).toEqual('some');
    expect(fizLogger.info('one more key', 'test')).toEqual('test');
  });

  it('should setUp keys and NOT print DEBUG log (because default log is INFO)', () => {
    expect(fizLogger.debug('debug.key', 'f1')).toEqual(undefined);
  });

  it('should setUp keys and print WARN log (because default log is INFO)', () => {
    expect(fizLogger.warn('w.firstKey', 'w1')).toEqual('w1');
  });

  it('should print DEBUG log, because I set up DEBUG level for key "mapKey"', () => {
    fizLogger.getLogModel().logItems
      .find((item: LogItem) => item.key === 'mapKey')
      .types.forEach((logType: LogType) => {
        if (logType.mod === LogMode.DEV) {
          logType.level = LogLevel.DEBUG;
        }
      });

    expect(fizLogger.debug('mapKey', 'should print debug msg')).toEqual('should print debug msg');
  });

  it('should NOT print WARN log, because I set up ERROR level for key "mapKey"', () => {
    fizLogger.getLogModel().logItems
      .find((item: LogItem) => item.key === 'mapKey')
      .types.filter((logType: LogType) => {
        if (logType.mod === LogMode.DEV) {
          logType.level = LogLevel.ERROR;
        }
      });

    expect(fizLogger.warn('mapKey', 'should NOT print me')).toEqual(undefined);
  });

  it('should print ERROR log for "mapKey"', () => {
    expect(fizLogger.error('mapKey', 'shit happens')).toEqual('shit happens');
  });

});
