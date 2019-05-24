import {TestBed} from '@angular/core/testing';
import {FizLogger, LogLevel, LogMode} from './fiz.logger';

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
  });

  it('Test INFO level log', () => {
    const testLogModel = {
      mode: LogMode.DEV,
      logItems: [
        {
          key: 'mapKey',
          types: [{mod: LogMode.DEV, level: LogLevel.DEBUG}]
        },
        {
          key: 'one more key',
          types: [{mod: LogMode.DEV, level: LogLevel.INFO}]
        },
        {
          key: 'WARN key',
          types: [{mod: LogMode.DEV, level: LogLevel.WARN}]
        },
      ]
    };

    fizLogger.setLogModel(testLogModel);

    expect(fizLogger.info('mapKey', 'test')).toEqual('test');
    expect(fizLogger.info('notExistKey', 'some')).toEqual(undefined);
    expect(fizLogger.info('one more key', 'test')).toEqual('test');
    expect(fizLogger.info('WARN key', 'test')).toEqual(undefined);
  });

});
