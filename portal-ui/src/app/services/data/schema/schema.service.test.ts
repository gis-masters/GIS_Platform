import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('./schema.client', () => ({
  schemaClient: {
    getSchema: jest.fn(),
    getTableSchemas: jest.fn(),
    createSchema: jest.fn(),
    updateSchema: jest.fn(),
    getSchemaAtUrl: jest.fn()
  }
}));

jest.mock('../../communication.service', () => ({
  communicationService: { schemaUpdated: { emit: jest.fn() } }
}));

jest.mock('../../../components/Toast/Toast', () => ({
  Toast: { error: jest.fn() }
}));

jest.mock('./tablesSchemasCache', () => ({
  tablesSchemasCache: { add: jest.fn() }
}));

// Тяжёлые/нерелевантные зависимости сервиса (mui, openlayers, импорт css) — мокаем,
// чтобы импорт schema.service не тянул их и не падал в jsdom.
jest.mock('../../gis/layers/layers.service', () => ({ getLayerSchema: jest.fn() }));
jest.mock('../../util/FeatureUtil', () => ({ FeatureUtil: { getLayerGeometry: jest.fn() } }));
jest.mock('./validators/printTemplatesExist', () => ({ printTemplatesExist: jest.fn() }));

import { Toast } from '../../../components/Toast/Toast';
import { communicationService } from '../../communication.service';
import { schemaClient } from './schema.client';
import { type Schema, type SchemaValidator } from './schema.models';
import { schemaService } from './schema.service';
import { type OldSchema } from './schemaOld.models';
import { tablesSchemasCache } from './tablesSchemasCache';

const getSchemaMock = jest.mocked(schemaClient.getSchema);
const getTableSchemasMock = jest.mocked(schemaClient.getTableSchemas);
const createSchemaMock = jest.mocked(schemaClient.createSchema);
const updateSchemaMock = jest.mocked(schemaClient.updateSchema);
const getSchemaAtUrlMock = jest.mocked(schemaClient.getSchemaAtUrl);
const emitMock = jest.mocked(communicationService.schemaUpdated.emit);
const cacheAddMock = jest.mocked(tablesSchemasCache.add);

type SchemaServiceInternals = {
  schemas: Record<string, Promise<OldSchema>>;
  schemasResolvers: Record<string, unknown>;
  schemasRejecters: Record<string, unknown>;
  fetchingPool: string[];
  fetchingAllSchemas: Promise<void> | undefined;
  fetchingNow: number;
  schemaWarningValidators: SchemaValidator[];
};

const internals = schemaService as unknown as SchemaServiceInternals;
const defaultValidators = internals.schemaWarningValidators;

function resetServiceState(): void {
  internals.schemas = {};
  internals.schemasResolvers = {};
  internals.schemasRejecters = {};
  internals.fetchingPool = [];
  internals.fetchingAllSchemas = undefined;
  internals.fetchingNow = 0;
  internals.schemaWarningValidators = defaultValidators;
}

function makeOldSchema(name: string, title: string = name): OldSchema {
  return { name, title, properties: [] };
}

function makeSchema(name: string, title: string = name): Schema {
  return { name, title, properties: [] };
}

// эмуляция ответа сервера с пустым телом (срабатывает ветка !response)
function emptyResponse(): (OldSchema | null)[] {
  return null as unknown as (OldSchema | null)[];
}

beforeEach(() => {
  jest.resetAllMocks();
  resetServiceState();
});

describe('SchemaService.getOldSchema', () => {
  test('возвращает схему из ответа сервера', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('road_line', 'Дороги')]);

    const schema = await schemaService.getOldSchema('road_line');

    expect(schema).toEqual(makeOldSchema('road_line', 'Дороги'));
    expect(getSchemaMock).toHaveBeenCalledTimes(1);
  });

  test('кеширует схему: повторный запрос не дёргает клиент', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('road_line')]);

    await schemaService.getOldSchema('road_line');
    await schemaService.getOldSchema('road_line');

    expect(getSchemaMock).toHaveBeenCalledTimes(1);
  });

  test('батчит параллельные запросы разных схем в один вызов клиента', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('a_line', 'A'), makeOldSchema('b_line', 'B')]);

    const [a, b] = await Promise.all([schemaService.getOldSchema('a_line'), schemaService.getOldSchema('b_line')]);

    expect(getSchemaMock).toHaveBeenCalledTimes(1);
    const callArg = getSchemaMock.mock.calls[0][0];
    expect(callArg).toEqual(expect.arrayContaining(['a_line', 'b_line']));
    expect(callArg).toHaveLength(2);
    expect(a.name).toBe('a_line');
    expect(b.name).toBe('b_line');
  });

  test('отклоняется ошибкой, если схемы нет в ответе, и её ловит try/catch вызывающего', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('other')]);

    await expect(schemaService.getOldSchema('missing')).rejects.toThrow('Не найдена схема missing');
  });

  test('отклоняется ошибкой при пустом ответе сервера', async () => {
    getSchemaMock.mockResolvedValue(emptyResponse());

    await expect(schemaService.getOldSchema('any')).rejects.toThrow(/Getting schemas .* error/);
  });

  test('после ошибки схема не кешируется и запрашивается заново', async () => {
    getSchemaMock.mockResolvedValueOnce([]);
    await expect(schemaService.getOldSchema('road_line')).rejects.toThrow('Не найдена схема road_line');

    getSchemaMock.mockResolvedValueOnce([makeOldSchema('road_line')]);
    const schema = await schemaService.getOldSchema('road_line');

    expect(schema.name).toBe('road_line');
    expect(getSchemaMock).toHaveBeenCalledTimes(2);
  });

  test('не порождает необработанных отклонений промисов (нет глобальной ошибки)', async () => {
    const unhandled: unknown[] = [];
    const handler = (reason: unknown): void => {
      unhandled.push(reason);
    };
    globalThis.process.on('unhandledRejection', handler);

    try {
      getSchemaMock.mockResolvedValueOnce([]);
      await expect(schemaService.getOldSchema('missing')).rejects.toBeInstanceOf(Error);

      getSchemaMock.mockResolvedValueOnce(emptyResponse());
      await expect(schemaService.getOldSchema('broken')).rejects.toBeInstanceOf(Error);

      // даём шанс отложенным отклонениям всплыть
      await new Promise(resolve => setTimeout(resolve, 50));
      await Promise.resolve();
    } finally {
      globalThis.process.off('unhandledRejection', handler);
    }

    expect(unhandled).toHaveLength(0);
  });
});

describe('SchemaService.getSchema', () => {
  test('возвращает сконвертированную (new) схему', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('road_line', 'Дороги')]);

    const schema = await schemaService.getSchema('road_line');

    expect(schema.name).toBe('road_line');
    expect(schema.title).toBe('Дороги');
    expect(schema.properties).toEqual([]);
  });
});

describe('SchemaService.getAllOldSchemas / getAllSchemas', () => {
  test('запрашивает все схемы пустым payload и возвращает их', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('a'), makeOldSchema('b')]);

    const all = await schemaService.getAllOldSchemas();

    expect(getSchemaMock).toHaveBeenCalledWith([]);
    expect(all.map(s => s.name).toSorted((a, b) => a.localeCompare(b))).toEqual(['a', 'b']);
  });

  test('повторный вызов getAllOldSchemas не запрашивает клиент заново', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('a')]);

    await schemaService.getAllOldSchemas();
    await schemaService.getAllOldSchemas();

    expect(getSchemaMock).toHaveBeenCalledTimes(1);
  });

  test('getAllSchemas возвращает сконвертированные схемы', async () => {
    getSchemaMock.mockResolvedValue([makeOldSchema('a', 'A'), makeOldSchema('b', 'B')]);

    const all = await schemaService.getAllSchemas();

    expect(all.map(s => s.title).toSorted((a, b) => a.localeCompare(b))).toEqual(['A', 'B']);
  });
});

describe('SchemaService.getSchemaAtUrl', () => {
  test('запрашивает схему по url и конвертирует её', async () => {
    getSchemaAtUrlMock.mockResolvedValue(makeOldSchema('road_line', 'Дороги'));

    const schema = await schemaService.getSchemaAtUrl('http://example/schema');

    expect(getSchemaAtUrlMock).toHaveBeenCalledWith('http://example/schema');
    expect(schema.name).toBe('road_line');
    expect(schema.title).toBe('Дороги');
  });
});

describe('SchemaService.fetchAndCacheTablesSchemas', () => {
  test('кладёт сконвертированные схемы таблиц в кеш по идентификатору', async () => {
    getTableSchemasMock.mockResolvedValue(new Map([['id1', makeOldSchema('s1')]]));

    await schemaService.fetchAndCacheTablesSchemas(['id1']);

    expect(getTableSchemasMock).toHaveBeenCalledWith(['id1']);
    expect(cacheAddMock).toHaveBeenCalledTimes(1);
    expect(cacheAddMock).toHaveBeenCalledWith('id1', expect.any(Promise));
  });
});

describe('SchemaService.createSchema', () => {
  test('сбрасывает кеш, шлёт схему на сервер и эмитит событие create', async () => {
    createSchemaMock.mockResolvedValue(makeOldSchema('n'));
    internals.schemas = { stale: Promise.resolve(makeOldSchema('stale')) };
    internals.fetchingAllSchemas = Promise.resolve();
    const schema = makeSchema('n', 't');

    await schemaService.createSchema(schema);

    expect(internals.schemas).toEqual({});
    expect(internals.fetchingAllSchemas).toBeUndefined();
    expect(createSchemaMock).toHaveBeenCalledWith({ name: 'n', title: 't', properties: [] });
    expect(emitMock).toHaveBeenCalledWith({ type: 'create', data: schema });
  });
});

describe('SchemaService.updateSchema', () => {
  test('сбрасывает кеш, шлёт схему на сервер и эмитит событие update', async () => {
    updateSchemaMock.mockResolvedValue(makeOldSchema('n'));
    internals.schemas = { stale: Promise.resolve(makeOldSchema('stale')) };
    const schema = makeSchema('n', 't');

    await schemaService.updateSchema(schema);

    expect(internals.schemas).toEqual({});
    expect(updateSchemaMock).toHaveBeenCalledWith({ name: 'n', title: 't', properties: [] });
    expect(emitMock).toHaveBeenCalledWith({ type: 'update', data: schema });
  });
});

describe('SchemaService.getPropertySchemaByName', () => {
  const props = [
    { name: 'ClassId', title: 'Класс' },
    { name: 'Length', title: 'Длина' }
  ] as unknown as OldSchema['properties'];

  test('находит свойство без учёта регистра', () => {
    const found = schemaService.getPropertySchemaByName('classid', props);

    expect(found?.title).toBe('Класс');
  });

  test('возвращает undefined, если свойство не найдено', () => {
    expect(schemaService.getPropertySchemaByName('nope', props)).toBeUndefined();
  });
});

describe('SchemaService.getSchemaWarnings', () => {
  test('агрегирует предупреждения от всех валидаторов', async () => {
    const validatorA: SchemaValidator = jest.fn<SchemaValidator>().mockResolvedValue(['w1', 'w2']);
    const validatorB: SchemaValidator = jest.fn<SchemaValidator>().mockResolvedValue(['w3']);
    internals.schemaWarningValidators = [validatorA, validatorB];
    const schema = makeSchema('n');

    const warnings = await schemaService.getSchemaWarnings(schema);

    expect(warnings).toEqual(['w1', 'w2', 'w3']);
    expect(validatorA).toHaveBeenCalledWith(schema);
    expect(validatorB).toHaveBeenCalledWith(schema);
  });

  test('возвращает пустой массив, если предупреждений нет', async () => {
    internals.schemaWarningValidators = [jest.fn<SchemaValidator>().mockResolvedValue([])];

    expect(await schemaService.getSchemaWarnings(makeSchema('n'))).toEqual([]);
  });
});

describe('SchemaService.fetch (через getOldSchema)', () => {
  test('показывает Toast при null-элементе в ответе', async () => {
    getSchemaMock.mockResolvedValue([null, makeOldSchema('road_line')]);

    await schemaService.getOldSchema('road_line');

    expect(Toast.error).toHaveBeenCalledWith('Возникла ошибка при загрузке схемы');
  });
});
