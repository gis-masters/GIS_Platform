import { describe, expect, test } from '@jest/globals';

import {
  formatGpkgReportIssues,
  isGpkgProcessReport,
  readGpkgFailedLayerNames,
  readGpkgReportIssues
} from './gpkg-report';

const tableMessages = [
  'Не хватает информации для создания новой векторной таблицы.',
  'В gpkg нет схемы данных. Генерация схемы на основе данных провалились. Таблица не будет импортирована!'
];

const tableError = { status: 'ERROR', dataset: 'dataset_c448b2', messages: tableMessages };

/** Отчёт процесса 168: статус процесса DONE, обе таблицы в отчёте помечены ERROR. */
function failedTablesReport(): unknown {
  return {
    status: 'COMPLETED',
    fileId: '27d43aa8-7897-412e-b8d4-7b818c268554',
    projectId: 2658,
    messages: ['Файл успешно прочитан. Импорт возможен.', 'Импорт успешно завершён.'],
    payload: {
      gpkgContents: [
        { type: 'features', dataType: 'FEATURES', tableName: 'parcels_coordination_2154_44b6f' },
        { type: 'features', dataType: 'FEATURES', tableName: 'parcels_coordination_16_8438' }
      ],
      project: { status: 'COMPLETED', projectId: 2658, title: 'Основной проект', messages: [] },
      tables: [
        { ...tableError, oldTableIdentifier: 'parcels_coordination_2154_44b6f' },
        { ...tableError, oldTableIdentifier: 'parcels_coordination_16_8438' }
      ],
      layers: [],
      styles: [],
      files: [],
      tiles: [],
      wrapperImportReport: { failedRecordCount: 0, utf8ErrorCount: 0 }
    }
  };
}

function placedTablesReport(payload: Record<string, unknown> = {}): unknown {
  return {
    status: 'COMPLETED',
    fileId: 'file-1',
    projectId: 7,
    messages: ['Импорт успешно завершён.'],
    payload: {
      tables: [{ status: 'COMPLETED', dataset: 'dataset_1', oldTableIdentifier: 'roads', messages: [] }],
      tiles: [],
      wrapperImportReport: { failedRecordCount: 0, utf8ErrorCount: 0 },
      ...payload
    }
  };
}

describe('isGpkgProcessReport', () => {
  test('отчёт импорта отличается от прочих details', () => {
    expect(isGpkgProcessReport(failedTablesReport())).toBe(true);
    expect(isGpkgProcessReport({ layerName: '', status: 'DONE', error: '' })).toBe(false);
    expect(isGpkgProcessReport({ content: [], page: {} })).toBe(false);
    expect(isGpkgProcessReport(null)).toBe(false);
  });

  test('отчёт об ошибке валидации без payload распознаётся', () => {
    // GpkgImporterExecutor.updateImportReportWithStatusError заполняет только fileId, статус и сообщения
    const report = {
      status: 'ERROR',
      fileId: '27d43aa8-7897-412e-b8d4-7b818c268554',
      messages: ['Файл успешно прочитан. Импорт возможен.', 'Ошибка при валидации GPKG файла => файл отсутствует']
    };

    expect(isGpkgProcessReport(report)).toBe(true);
    expect(readGpkgReportIssues(report)).toEqual([
      { scope: 'project', name: '', message: 'Ошибка при валидации GPKG файла => файл отсутствует' }
    ]);
  });
});

describe('readGpkgReportIssues', () => {
  test('таблицы со статусом ERROR при статусе процесса DONE', () => {
    const issues = readGpkgReportIssues(failedTablesReport());

    expect(issues).toEqual([
      { scope: 'table', name: 'parcels_coordination_2154_44b6f', message: tableMessages[1] },
      { scope: 'table', name: 'parcels_coordination_16_8438', message: tableMessages[1] }
    ]);
    expect(readGpkgFailedLayerNames(issues)).toEqual(
      new Set(['parcels_coordination_2154_44b6f', 'parcels_coordination_16_8438'])
    );
  });

  test('успешный отчёт без ошибок', () => {
    expect(readGpkgReportIssues(placedTablesReport())).toEqual([]);
  });

  test('счётчики записей отчёта', () => {
    expect(
      readGpkgReportIssues(placedTablesReport({ wrapperImportReport: { failedRecordCount: 12, utf8ErrorCount: 1 } }))
    ).toEqual([
      { scope: 'records', name: '', message: 'Записей не импортировано: 12' },
      { scope: 'records', name: '', message: 'Записей с ошибками UTF-8: 1' }
    ]);
  });

  test('ошибки тайлов, слоёв и проекта', () => {
    const issues = readGpkgReportIssues(
      placedTablesReport({
        tables: [],
        tiles: [{ status: 'ERROR', gpkgLayerTableName: 'tiles_1', messages: ['Растровый набор не импортирован'] }],
        project: { status: 'ERROR', title: 'Основной проект', messages: ['Нет прав на проект'] }
      })
    );

    expect(issues).toEqual([
      { scope: 'tile', name: 'tiles_1', message: 'Растровый набор не импортирован' },
      { scope: 'project', name: '', message: 'Нет прав на проект' }
    ]);
    expect(readGpkgFailedLayerNames(issues)).toEqual(new Set(['tiles_1']));
  });

  test('имя стиля, файла и проекта не считается именем слоя gpkg', () => {
    // имя стиля часто совпадает с именем таблицы, layers[].tableIdentifier содержит
    // resourceId целевого слоя, поэтому сопоставлять слои с таблицами gpkg нельзя
    const issues = readGpkgReportIssues(
      placedTablesReport({
        tables: [{ status: 'COMPLETED', oldTableIdentifier: 'roads', messages: [] }],
        styles: [{ status: 'ERROR', name: 'roads', messages: ['Стиль не импортирован'] }],
        files: [{ status: 'ERROR', tableName: 'roads', messages: ['Файл не импортирован'] }],
        layers: [{ status: 'ERROR', tableIdentifier: 'dataset_1.roads', messages: ['Слой не создан'] }],
        project: { status: 'ERROR', title: 'roads', messages: ['Проект недоступен'] }
      })
    );

    expect(issues.map(issue => issue.scope)).toEqual(['layer', 'style', 'file', 'project']);
    expect(readGpkgFailedLayerNames(issues)).toEqual(new Set());
  });

  test('ошибка слоя при импортированной таблице не помечает слой упавшим', () => {
    const issues = readGpkgReportIssues(
      placedTablesReport({
        tables: [{ status: 'COMPLETED', oldTableIdentifier: 'roads', messages: [] }],
        layers: [{ status: 'ERROR', tableIdentifier: 'dataset_1.roads', messages: ['Слой не создан'] }]
      })
    );

    expect(issues).toHaveLength(1);
    expect(readGpkgFailedLayerNames(issues).has('roads')).toBe(false);
  });

  test('не-GPKG отчёт и пустые коллекции', () => {
    expect(readGpkgReportIssues({ layerName: '', status: 'ERROR', error: 'boom' })).toEqual([]);
    expect(readGpkgReportIssues(placedTablesReport({ tiles: {}, files: 'нет' }))).toEqual([]);
  });

  test('отчёт без сообщений об ошибке даёт запасной текст', () => {
    expect(readGpkgReportIssues({ status: 'ERROR', fileId: 'file-1', messages: [] })).toEqual([
      { scope: 'project', name: '', message: 'Импорт завершён с ошибкой' }
    ]);
  });
});

describe('formatGpkgReportIssues', () => {
  test('одинаковые сообщения схлопываются в одно', () => {
    const issues = readGpkgReportIssues(failedTablesReport());

    expect(formatGpkgReportIssues(issues)).toBe(tableMessages[1]);
  });

  test('разные сообщения соединяются точкой с запятой, а не переносом строки', () => {
    const issues = readGpkgReportIssues(
      placedTablesReport({
        tables: [
          { status: 'ERROR', oldTableIdentifier: 'roads', messages: ['Нет схемы данных'] },
          { status: 'ERROR', oldTableIdentifier: 'buildings', messages: ['Не удалось создать слой'] }
        ]
      })
    );

    expect(formatGpkgReportIssues(issues)).toBe('Нет схемы данных; Не удалось создать слой');
  });

  test('без ошибок пустая строка', () => {
    expect(formatGpkgReportIssues([])).toBe('');
  });
});

describe('readGpkgFailedLayerNames', () => {
  test('безымянные ошибки не дают имён слоёв', () => {
    expect(readGpkgFailedLayerNames([{ scope: 'records', name: '', message: 'Записей не импортировано: 5' }])).toEqual(
      new Set()
    );
  });
});
