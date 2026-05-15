import { PropertyType, type Schema } from '../schema.models';
import { collectPrintTemplateNames } from './collectPrintTemplateNames';

describe('collectPrintTemplateNames', () => {
  const base: Pick<Schema, 'name' | 'title' | 'properties'> = {
    name: 'lib',
    title: 'Библиотека',
    properties: [{ name: 'id', title: 'Id', propertyType: PropertyType.STRING }]
  };

  test('без шаблонов на схеме, в представлениях и типах контента возвращает пустой массив', () => {
    const schema: Schema = { ...base };
    expect(collectPrintTemplateNames(schema)).toStrictEqual([]);
  });

  test('включает шаблоны с корня схемы', () => {
    const schema: Schema = {
      ...base,
      printTemplates: ['rep1', 'rep2']
    };
    expect(collectPrintTemplateNames(schema)).toStrictEqual(['rep1', 'rep2']);
  });

  test('добавляет шаблоны из представлений и типов контента', () => {
    const schema: Schema = {
      ...base,
      printTemplates: ['root'],
      views: [
        {
          id: 'v1',
          type: 'VIEW',
          properties: [],
          printTemplates: ['view_tpl']
        }
      ],
      contentTypes: [
        {
          id: 'ct1',
          type: 'DOCUMENT',
          properties: [],
          printTemplates: ['doc_tpl']
        }
      ]
    };
    expect(collectPrintTemplateNames(schema)).toStrictEqual(['root', 'view_tpl', 'doc_tpl']);
  });

  test('убирает дубликаты имени, встречающегося в разных местах', () => {
    const schema: Schema = {
      ...base,
      printTemplates: ['same', 'only_root'],
      views: [
        {
          id: 'v1',
          type: 'VIEW',
          properties: [],
          printTemplates: ['same']
        }
      ],
      contentTypes: [
        {
          id: 'ct1',
          type: 'DOCUMENT',
          properties: [],
          printTemplates: ['same', 'only_ct']
        }
      ]
    };
    expect(collectPrintTemplateNames(schema)).toStrictEqual(['same', 'only_root', 'only_ct']);
  });
});
