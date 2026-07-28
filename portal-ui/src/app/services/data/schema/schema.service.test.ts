import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('./schema.client', () => ({
  schemaClient: {
    getTableSchemas: jest.fn(),
    createSchema: jest.fn(),
    updateSchema: jest.fn(),
    deleteSchema: jest.fn(),
    getSchemaAtUrl: jest.fn()
  }
}));

jest.mock('../schemaTemplate/schemaTemplate.service', () => ({
  schemaTemplateService: {
    clearCache: jest.fn(),
    getSchemaTemplatesWithOldSchema: jest.fn()
  }
}));

jest.mock('../../communication.service', () => ({
  communicationService: { schemaUpdated: { emit: jest.fn() } }
}));

jest.mock('./tablesSchemasCache', () => ({
  tablesSchemasCache: { add: jest.fn() }
}));

jest.mock('../../gis/layers/layers.service', () => ({ getLayerSchema: jest.fn() }));
jest.mock('../../util/FeatureUtil', () => ({ FeatureUtil: { getLayerGeometry: jest.fn() } }));
jest.mock('./validators/printTemplatesExist', () => ({ printTemplatesExist: jest.fn() }));

import { communicationService } from '../../communication.service';
import { schemaTemplateService } from '../schemaTemplate/schemaTemplate.service';
import { schemaClient } from './schema.client';
import { type Schema, type SchemaValidator } from './schema.models';
import { schemaService } from './schema.service';
import { type OldSchema } from './schemaOld.models';
import { tablesSchemasCache } from './tablesSchemasCache';

const getTableSchemasMock = jest.mocked(schemaClient.getTableSchemas);
const createSchemaMock = jest.mocked(schemaClient.createSchema);
const updateSchemaMock = jest.mocked(schemaClient.updateSchema);
const deleteSchemaMock = jest.mocked(schemaClient.deleteSchema);
const getSchemaAtUrlMock = jest.mocked(schemaClient.getSchemaAtUrl);
const emitMock = jest.mocked(communicationService.schemaUpdated.emit);
const cacheAddMock = jest.mocked(tablesSchemasCache.add);
const clearCacheMock = jest.mocked(schemaTemplateService.clearCache);

type SchemaServiceInternals = {
  schemaWarningValidators: SchemaValidator[];
};

const internals = schemaService as unknown as SchemaServiceInternals;
const defaultValidators = internals.schemaWarningValidators;

function makeOldSchema(name: string, title: string = name): OldSchema {
  return { name, title, properties: [] };
}

function makeSchema(name: string, title: string = name): Schema {
  return { name, title, properties: [] };
}

beforeEach(() => {
  jest.resetAllMocks();
  internals.schemaWarningValidators = defaultValidators;
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
  test('сбрасывает кеш шаблонов, шлёт схему на сервер и эмитит событие create', async () => {
    createSchemaMock.mockResolvedValue(makeOldSchema('n'));
    const schema = makeSchema('n', 't');

    await schemaService.createSchema(schema);

    expect(clearCacheMock).toHaveBeenCalledTimes(1);
    expect(createSchemaMock).toHaveBeenCalledWith({ name: 'n', title: 't', properties: [] });
    expect(emitMock).toHaveBeenCalledWith({ type: 'create', data: schema });
  });
});

describe('SchemaService.updateSchema', () => {
  test('сбрасывает кеш шаблонов, шлёт схему на сервер и эмитит событие update', async () => {
    updateSchemaMock.mockResolvedValue(makeOldSchema('n'));
    const schema = makeSchema('n', 't');

    await schemaService.updateSchema(schema);

    expect(clearCacheMock).toHaveBeenCalledTimes(1);
    expect(updateSchemaMock).toHaveBeenCalledWith({ name: 'n', title: 't', properties: [] });
    expect(emitMock).toHaveBeenCalledWith({ type: 'update', data: schema });
  });
});

describe('SchemaService.deleteSchema', () => {
  test('сбрасывает кеш шаблонов, удаляет схему и эмитит событие delete', async () => {
    deleteSchemaMock.mockResolvedValue();
    const schema = makeSchema('n', 't');

    await schemaService.deleteSchema(schema);

    expect(clearCacheMock).toHaveBeenCalledTimes(1);
    expect(deleteSchemaMock).toHaveBeenCalledWith('n');
    expect(emitMock).toHaveBeenCalledWith({ type: 'delete', data: schema });
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
