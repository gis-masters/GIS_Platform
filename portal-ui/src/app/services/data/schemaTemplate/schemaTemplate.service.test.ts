import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('./schemaTemplate.client', () => ({
  schemaTemplateClient: {
    getSchemaTemplates: jest.fn()
  }
}));

jest.mock('../../../components/Toast/Toast', () => ({
  Toast: { error: jest.fn() }
}));

import { Toast } from '../../../components/Toast/Toast';
import { type OldSchema } from '../schema/schemaOld.models';
import { schemaTemplateClient } from './schemaTemplate.client';
import { type SchemaTemplateWithOldSchema } from './schemaTemplate.models';
import { schemaTemplateService } from './schemaTemplate.service';

const getSchemaTemplatesMock = jest.mocked(schemaTemplateClient.getSchemaTemplates);

function makeOldSchema(name: string, title: string = name): OldSchema {
  return { name, title, properties: [] };
}

function makeTemplate(name: string, title: string = name): SchemaTemplateWithOldSchema {
  return {
    id: 1,
    name,
    classRule: makeOldSchema(name, title),
    customRule: '',
    calculatedFields: '',
    system: false,
    createdBy: 'user',
    createdAt: '',
    lastModified: '',
    modifiedBy: ''
  };
}

function emptyResponse(): SchemaTemplateWithOldSchema[] {
  return null as unknown as SchemaTemplateWithOldSchema[];
}

beforeEach(() => {
  jest.resetAllMocks();
  schemaTemplateService.clearCache();
});

describe('schemaTemplateService.getSchemaTemplateWithOldSchema', () => {
  test('возвращает шаблон из ответа сервера', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('road_line', 'Дороги')]);

    const template = await schemaTemplateService.getSchemaTemplateWithOldSchema('road_line');

    expect(template).toEqual(makeTemplate('road_line', 'Дороги'));
    expect(getSchemaTemplatesMock).toHaveBeenCalledTimes(1);
  });

  test('кеширует шаблон: повторный запрос не дёргает клиент', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('road_line')]);

    await schemaTemplateService.getSchemaTemplateWithOldSchema('road_line');
    await schemaTemplateService.getSchemaTemplateWithOldSchema('road_line');

    expect(getSchemaTemplatesMock).toHaveBeenCalledTimes(1);
  });

  test('батчит параллельные запросы разных шаблонов в один вызов клиента', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('a_line', 'A'), makeTemplate('b_line', 'B')]);

    const [a, b] = await Promise.all([
      schemaTemplateService.getSchemaTemplateWithOldSchema('a_line'),
      schemaTemplateService.getSchemaTemplateWithOldSchema('b_line')
    ]);

    expect(getSchemaTemplatesMock).toHaveBeenCalledTimes(1);
    const callArg = getSchemaTemplatesMock.mock.calls[0][0];
    expect(callArg).toEqual(expect.arrayContaining(['a_line', 'b_line']));
    expect(callArg).toHaveLength(2);
    expect(a.name).toBe('a_line');
    expect(b.name).toBe('b_line');
  });

  test('отклоняется ошибкой, если шаблона нет в ответе', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('other')]);

    await expect(schemaTemplateService.getSchemaTemplateWithOldSchema('missing')).rejects.toThrow(
      'Не найдена схема missing'
    );
  });

  test('отклоняется ошибкой при пустом ответе сервера', async () => {
    getSchemaTemplatesMock.mockResolvedValue(emptyResponse());

    await expect(schemaTemplateService.getSchemaTemplateWithOldSchema('any')).rejects.toThrow(
      /Getting schema templates .* error/
    );
  });

  test('после ошибки шаблон не кешируется и запрашивается заново', async () => {
    getSchemaTemplatesMock.mockResolvedValueOnce([]);
    await expect(schemaTemplateService.getSchemaTemplateWithOldSchema('road_line')).rejects.toThrow(
      'Не найдена схема road_line'
    );

    getSchemaTemplatesMock.mockResolvedValueOnce([makeTemplate('road_line')]);
    const template = await schemaTemplateService.getSchemaTemplateWithOldSchema('road_line');

    expect(template.name).toBe('road_line');
    expect(getSchemaTemplatesMock).toHaveBeenCalledTimes(2);
  });

  test('не порождает необработанных отклонений промисов', async () => {
    const unhandled: unknown[] = [];
    const handler = (reason: unknown): void => {
      unhandled.push(reason);
    };
    globalThis.process.on('unhandledRejection', handler);

    try {
      getSchemaTemplatesMock.mockResolvedValueOnce([]);
      await expect(schemaTemplateService.getSchemaTemplateWithOldSchema('missing')).rejects.toBeInstanceOf(Error);

      getSchemaTemplatesMock.mockResolvedValueOnce(emptyResponse());
      await expect(schemaTemplateService.getSchemaTemplateWithOldSchema('broken')).rejects.toBeInstanceOf(Error);

      await new Promise(resolve => setTimeout(resolve, 50));
      await Promise.resolve();
    } finally {
      globalThis.process.off('unhandledRejection', handler);
    }

    expect(unhandled).toHaveLength(0);
  });
});

describe('schemaTemplateService.getSchemaTemplate', () => {
  test('возвращает шаблон со сконвертированной classRule', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('road_line', 'Дороги')]);

    const template = await schemaTemplateService.getSchemaTemplate('road_line');

    expect(template.name).toBe('road_line');
    expect(template.classRule.title).toBe('Дороги');
    expect(template.classRule.properties).toEqual([]);
  });
});

describe('schemaTemplateService.getSchemaTemplatesWithOldSchema / getSchemaTemplates', () => {
  test('запрашивает все шаблоны пустым payload и возвращает их', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('a'), makeTemplate('b')]);

    const all = await schemaTemplateService.getSchemaTemplatesWithOldSchema();

    expect(getSchemaTemplatesMock).toHaveBeenCalledWith([]);
    expect(all.map(s => s.name).toSorted((a, b) => a.localeCompare(b))).toEqual(['a', 'b']);
  });

  test('повторный вызов getSchemaTemplatesWithOldSchema не запрашивает клиент заново', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('a')]);

    await schemaTemplateService.getSchemaTemplatesWithOldSchema();
    await schemaTemplateService.getSchemaTemplatesWithOldSchema();

    expect(getSchemaTemplatesMock).toHaveBeenCalledTimes(1);
  });

  test('getSchemaTemplates возвращает сконвертированные classRule', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('a', 'A'), makeTemplate('b', 'B')]);

    const all = await schemaTemplateService.getSchemaTemplates();

    expect(all.map(s => s.classRule.title).toSorted((a, b) => a.localeCompare(b))).toEqual(['A', 'B']);
  });
});

describe('fetch (через getSchemaTemplateWithOldSchema)', () => {
  test('показывает Toast при null-элементе в ответе', async () => {
    getSchemaTemplatesMock.mockResolvedValue([
      null as unknown as SchemaTemplateWithOldSchema,
      makeTemplate('road_line')
    ]);

    await schemaTemplateService.getSchemaTemplateWithOldSchema('road_line');

    expect(Toast.error).toHaveBeenCalledWith('Возникла ошибка при загрузке шаблона схемы');
  });
});

describe('schemaTemplateService.clearCache', () => {
  test('сбрасывает кеш и позволяет запросить шаблоны заново', async () => {
    getSchemaTemplatesMock.mockResolvedValue([makeTemplate('a')]);

    await schemaTemplateService.getSchemaTemplatesWithOldSchema();
    schemaTemplateService.clearCache();
    await schemaTemplateService.getSchemaTemplatesWithOldSchema();

    expect(getSchemaTemplatesMock).toHaveBeenCalledTimes(2);
  });
});
