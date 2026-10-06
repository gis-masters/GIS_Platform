import { type GpkgProcessReport } from '../../../../server-types/common-contracts';
import { isArray } from '../../util/typeGuards/isArray';
import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';
import { isStringArray } from '../../util/typeGuards/isStringArray';

export type GpkgReportIssueScope = 'table' | 'layer' | 'tile' | 'style' | 'file' | 'project' | 'records';

export type GpkgReportIssue = {
  scope: GpkgReportIssueScope;
  /**
   * Наименование слоя в gpkg, если сущность его однозначно задаёт.
   * Заполняется только для таблиц (oldTableIdentifier) и тайлов (gpkgLayerTableName):
   * имя стиля, файла или проекта может совпасть с именем таблицы, а layers[].tableIdentifier
   * содержит идентификатор таблицы в целевом наборе данных, а не имя слоя gpkg.
   */
  name: string;
  message: string;
};

type GpkgEntityCollection = {
  key: string;
  scope: GpkgReportIssueScope;
  /** Поле отчёта, содержащее имя слоя gpkg. Пусто, если имя слоя определить нельзя. */
  layerNameKey: string;
  fallback: string;
};

const entityCollections: GpkgEntityCollection[] = [
  { key: 'tables', scope: 'table', layerNameKey: 'oldTableIdentifier', fallback: 'Не удалось импортировать таблицу' },
  {
    key: 'tiles',
    scope: 'tile',
    layerNameKey: 'gpkgLayerTableName',
    fallback: 'Не удалось импортировать растровый набор'
  },
  { key: 'layers', scope: 'layer', layerNameKey: '', fallback: 'Не удалось создать слой' },
  { key: 'styles', scope: 'style', layerNameKey: '', fallback: 'Не удалось импортировать стиль' },
  { key: 'files', scope: 'file', layerNameKey: '', fallback: 'Не удалось импортировать файл' },
  { key: 'project', scope: 'project', layerNameKey: '', fallback: 'Не удалось разместить данные в проекте' }
];

const errorStatus = 'ERROR';

const importFallbackMessage = 'Импорт завершён с ошибкой';

/**
 * Отчёт процесса импорта GPKG: статус процесса при этом может быть DONE.
 * Отличаем его от прочих details (ProcessTasks, PageableResources и т.п.).
 * При ошибке валидации отчёт содержит только fileId, статус и сообщения.
 */
export function isGpkgProcessReport(details: unknown): details is GpkgProcessReport {
  return (
    isRecordStringUnknown(details) &&
    typeof details.fileId === 'string' &&
    typeof details.status === 'string' &&
    isStringArray(details.messages)
  );
}

function lastMessage(value: unknown): string | undefined {
  if (!isStringArray(value)) {
    return undefined;
  }

  return value.findLast(Boolean);
}

function readEntityIssue(entity: unknown, collection: GpkgEntityCollection): GpkgReportIssue | undefined {
  if (!isRecordStringUnknown(entity) || entity.status !== errorStatus) {
    return undefined;
  }

  const name = collection.layerNameKey ? entity[collection.layerNameKey] : undefined;

  return {
    scope: collection.scope,
    name: typeof name === 'string' ? name : '',
    message: lastMessage(entity.messages) ?? collection.fallback
  };
}

function readCollectionIssues(payload: unknown): GpkgReportIssue[] {
  if (!isRecordStringUnknown(payload)) {
    return [];
  }

  return entityCollections.flatMap(collection => {
    const entities = payload[collection.key];

    if (isArray(entities)) {
      return entities
        .map(entity => readEntityIssue(entity, collection))
        .filter((issue): issue is GpkgReportIssue => issue != null);
    }

    const issue = readEntityIssue(entities, collection);

    return issue ? [issue] : [];
  });
}

function readRecordsIssues(payload: unknown): GpkgReportIssue[] {
  const report = isRecordStringUnknown(payload) ? payload.wrapperImportReport : undefined;

  if (!isRecordStringUnknown(report)) {
    return [];
  }

  const issues: GpkgReportIssue[] = [];
  const { failedRecordCount, utf8ErrorCount } = report;

  if (typeof failedRecordCount === 'number' && failedRecordCount > 0) {
    issues.push({
      scope: 'records',
      name: '',
      message: `Записей не импортировано: ${failedRecordCount}`
    });
  }

  if (typeof utf8ErrorCount === 'number' && utf8ErrorCount > 0) {
    issues.push({
      scope: 'records',
      name: '',
      message: `Записей с ошибками UTF-8: ${utf8ErrorCount}`
    });
  }

  return issues;
}

/**
 * Ошибки импорта GPKG: процесс может завершиться со статусом DONE, тогда как часть
 * сущностей в details.payload помечена ERROR. Ошибка отчёта без ошибок сущностей берётся
 * из последнего сообщения: бэкенд дописывает его в updateImportReportWithStatusError.
 */
export function readGpkgReportIssues(details: unknown): GpkgReportIssue[] {
  if (!isGpkgProcessReport(details)) {
    return [];
  }

  const issues = [...readCollectionIssues(details.payload), ...readRecordsIssues(details.payload)];

  if (issues.length === 0 && details.status === errorStatus) {
    issues.push({ scope: 'project', name: '', message: lastMessage(details.messages) ?? importFallbackMessage });
  }

  return issues;
}

/** Сообщения склеиваются в строку: их показывают и тосты, и подсказки таблицы. */
export function formatGpkgReportIssues(issues: GpkgReportIssue[]): string {
  const messages = issues
    .map(issue => issue.message)
    .filter((message, index, all) => message && all.indexOf(message) === index);

  return messages.join('; ');
}

/** Имена слоёв gpkg, которые отчёт пометил ошибкой. */
export function readGpkgFailedLayerNames(issues: GpkgReportIssue[]): Set<string> {
  return new Set(issues.flatMap(issue => (issue.name ? [issue.name] : [])));
}
