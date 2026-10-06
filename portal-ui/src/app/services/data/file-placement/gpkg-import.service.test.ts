import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('../../../components/Toast/Toast', () => ({
  Toast: {
    show: jest.fn(() => 'toast-1'),
    update: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    defaultDuration: 1
  }
}));

jest.mock('../../../components/GpkgImportToast/GpkgImportToast', () => ({
  GpkgImportToast: () => null
}));

jest.mock('../../../components/GpkgImportToastDetails/GpkgImportToastDetails', () => ({
  GpkgImportToastDetails: () => null
}));

jest.mock('../../communication.service', () => ({
  communicationService: {
    fileConnectionsUpdated: { emit: jest.fn() }
  }
}));

jest.mock('../../gis/projects/projects.service', () => ({
  projectsService: {
    deleteGroup: jest.fn()
  }
}));

jest.mock('../files/files.service', () => ({
  deleteFile: jest.fn()
}));

jest.mock('./file-placement.service', () => ({
  placeGpkg: jest.fn()
}));

jest.mock('../processes/processes.service', () => ({
  awaitProcess: jest.fn(),
  getProcess: jest.fn(),
  getProcessErrorMessage: jest.fn(),
  getRecentImportProcesses: jest.fn(),
  isTransientProcessPollError: jest.fn()
}));

import { Toast } from '../../../components/Toast/Toast';
import { currentUser } from '../../../stores/CurrentUser.store';
import { gpkgImportStore } from '../../../stores/GpkgImport.store';
import { communicationService } from '../../communication.service';
import { projectsService } from '../../gis/projects/projects.service';
import { type Process, ProcessStatus, ProcessType } from '../processes/processes.models';
import { getProcess } from '../processes/processes.service';
import { resumePersistedGpkgImports } from './gpkg-import.service';

const getProcessMock = jest.mocked(getProcess);
const emitMock = jest.mocked(communicationService.fileConnectionsUpdated.emit);
const deleteGroupMock = jest.mocked(projectsService.deleteGroup);
const toastErrorMock = jest.mocked(Toast.error);
const toastUpdateMock = jest.mocked(Toast.update);

const storageKey = 'gpkgImports_9_5';

const tableErrorMessage = 'В gpkg нет схемы данных. Таблица не будет импортирована!';
const styleErrorMessage = 'Стиль не импортирован';

function doneProcess(id: number): Process {
  return {
    id,
    userName: 'user',
    title: 'import',
    status: ProcessStatus.DONE,
    type: ProcessType.IMPORT,
    extra: undefined,
    details: { layerName: '', status: ProcessStatus.DONE, error: '' }
  };
}

/** Отчёт импорта GPKG: статус процесса DONE, таблицы в details.payload имеют свой статус. */
function gpkgProcess(id: number, tables: Array<{ name: string; status: string }>): Process {
  return {
    ...doneProcess(id),
    details: {
      status: 'COMPLETED',
      fileId: `file-${id}`,
      projectId: 7,
      messages: ['Импорт успешно завершён.'],
      payload: {
        tables: tables.map(table => ({
          status: table.status,
          dataset: 'dataset_1',
          oldTableIdentifier: table.name,
          messages: table.status === 'ERROR' ? [tableErrorMessage] : []
        })),
        wrapperImportReport: { failedRecordCount: 0, utf8ErrorCount: 0 }
      }
    }
  } as unknown as Process;
}

/** Таблица размещена, но стиль с тем же именем, что и таблица, не импортирован. */
function styleErrorProcess(id: number): Process {
  return {
    ...doneProcess(id),
    details: {
      status: 'COMPLETED',
      fileId: `file-${id}`,
      projectId: 7,
      messages: ['Импорт успешно завершён.'],
      payload: {
        tables: [{ status: 'COMPLETED', oldTableIdentifier: 'roads', messages: [] }],
        styles: [{ status: 'ERROR', name: 'roads', messages: [styleErrorMessage] }],
        wrapperImportReport: { failedRecordCount: 0, utf8ErrorCount: 0 }
      }
    }
  } as unknown as Process;
}

function persistedImport(processId: number, fileId: string, layerGroupId: number, vectorLayers: string[]) {
  return {
    processId,
    fileId,
    projectId: 7,
    tableName: vectorLayers.join(', '),
    payloadIndex: 0,
    features: vectorLayers.length,
    tiles: 0,
    layerGroupId,
    vectorLayers
  };
}

describe('resumePersistedGpkgImports', () => {
  beforeEach(() => {
    localStorage.clear();
    gpkgImportStore.clear();
    jest.clearAllMocks();
    currentUser.setOrgInfo({
      id: 5,
      orgId: 9,
      email: '',
      name: '',
      surname: '',
      login: '',
      geoserverLogin: '',
      enabled: true,
      authorities: [],
      createdAt: '',
      orgName: ''
    });
  });

  // модуль возобновляет импорты один раз за сессию, поэтому все случаи проверяются одним вызовом
  test('статус импорта учитывает ошибки таблиц в отчёте при статусе процесса DONE', async () => {
    const placed = persistedImport(42, 'file-placed', 15, ['roads']);
    const failed = persistedImport(43, 'file-failed', 16, [
      'parcels_coordination_2154_44b6f',
      'parcels_coordination_16_8438'
    ]);
    const partial = persistedImport(44, 'file-partial', 17, ['roads', 'buildings']);
    // имя стиля совпадает с именем таблицы: слой размещён, ошибка только в стиле
    const styleOnly = persistedImport(45, 'file-style', 18, ['roads']);

    localStorage.setItem(storageKey, JSON.stringify([placed, failed, partial, styleOnly]));

    getProcessMock.mockImplementation(id => {
      if (id === 42) {
        return Promise.resolve(doneProcess(42));
      }

      if (id === 43) {
        return Promise.resolve(
          gpkgProcess(43, [
            { name: 'parcels_coordination_2154_44b6f', status: 'ERROR' },
            { name: 'parcels_coordination_16_8438', status: 'ERROR' }
          ])
        );
      }

      if (id === 45) {
        return Promise.resolve(styleErrorProcess(45));
      }

      return Promise.resolve(
        gpkgProcess(44, [
          { name: 'roads', status: 'COMPLETED' },
          { name: 'buildings', status: 'ERROR' }
        ])
      );
    });

    await resumePersistedGpkgImports();

    expect(localStorage.getItem(storageKey)).toBeNull();

    // слой размещён: список слоёв обновляется, группа остаётся
    expect(gpkgImportStore.isGroupPlaced(15)).toBe(true);
    expect(deleteGroupMock).not.toHaveBeenCalledWith(15);

    // все таблицы не импортированы: группа пуста и удаляется, пользователь видит ошибку
    expect(gpkgImportStore.isGroupPlaced(16)).toBe(false);
    expect(deleteGroupMock).toHaveBeenCalledWith(16);
    expect(toastErrorMock).toHaveBeenCalledWith(tableErrorMessage, { toastId: 'toast-1' });

    // часть таблиц не импортирована: группа остаётся, импорт завершён с предупреждением
    expect(gpkgImportStore.isGroupPlaced(17)).toBe(true);
    expect(deleteGroupMock).not.toHaveBeenCalledWith(17);

    // ошибка стиля с именем таблицы не считается ошибкой слоя: группа не удаляется
    expect(gpkgImportStore.isGroupPlaced(18)).toBe(true);
    expect(deleteGroupMock).not.toHaveBeenCalledWith(18);

    // успешных импортов один, с предупреждением два: частичная ошибка таблиц и ошибка стиля
    expect(toastUpdateMock).toHaveBeenCalledWith('toast-1', expect.objectContaining({ type: 'success' }));
    expect(
      toastUpdateMock.mock.calls.filter(([, options]) => (options as { type?: string }).type === 'warning')
    ).toHaveLength(2);

    // список слоёв обновляется во всех случаях, кроме полностью упавшего импорта
    expect(emitMock).toHaveBeenCalledTimes(3);
    expect(emitMock).toHaveBeenCalledWith({ type: 'create', data: [] });
  });
});
