import { describe, expect, test } from '@jest/globals';

import { PropertyType, type Schema } from '../schema.models';
import { getEffectiveAsTitle } from './getEffectiveAsTitle';

const createSchema = (): Schema => ({
  name: 'as_title_content_types',
  title: 'asTitle + content types',
  properties: [
    {
      name: 'title',
      title: 'Название',
      propertyType: PropertyType.STRING,
      asTitle: true
    },
    {
      name: 'name',
      title: 'Имя',
      propertyType: PropertyType.STRING
    }
  ],
  contentTypes: [
    {
      id: 'ct_inherit',
      type: 'DOCUMENT',
      title: 'Тип: наследует asTitle с корня',
      properties: [{ name: 'title' }, { name: 'name' }]
    },
    {
      id: 'ct_own',
      type: 'DOCUMENT',
      title: 'Тип: свой asTitle на name',
      properties: [{ name: 'title' }, { name: 'name', asTitle: true }]
    },
    {
      id: 'ct_title_only',
      type: 'DOCUMENT',
      title: 'Тип: только title, без propertyType',
      properties: [{ name: 'title' }]
    }
  ],
  views: [
    {
      id: 'view_inherit',
      type: 'VIEW',
      title: 'Представление: наследует asTitle с корня',
      properties: [{ name: 'title' }, { name: 'name' }]
    },
    {
      id: 'view_own',
      type: 'VIEW',
      title: 'Представление: свой asTitle на name',
      properties: [{ name: 'title' }, { name: 'name', asTitle: true }]
    }
  ]
});

describe('эффективный заголовок схемы getEffectiveAsTitle', () => {
  test('если тип документа и представление не выбраны то заголовок берётся с корня', () => {
    expect(getEffectiveAsTitle(createSchema())).toBe('title');
  });

  test('если у типа документа нет своего asTitle то заголовок наследуется с корня', () => {
    expect(getEffectiveAsTitle(createSchema(), 'ct_inherit')).toBe('title');
  });

  test('если у типа документа своё asTitle true то заголовком становится это свойство а не унаследованное', () => {
    expect(getEffectiveAsTitle(createSchema(), 'ct_own')).toBe('name');
  });

  test('если у унаследованного поля типа документа явно asTitle false то заголовок остаётся своим полем', () => {
    const schema = createSchema();
    const contentType = schema.contentTypes?.find(item => item.id === 'ct_own');

    if (contentType) {
      contentType.properties = [
        { name: 'title', asTitle: false },
        { name: 'name', asTitle: true }
      ];
    }

    expect(getEffectiveAsTitle(schema, 'ct_own')).toBe('name');
  });

  test('если у представления нет своего asTitle то заголовок наследуется с корня', () => {
    expect(getEffectiveAsTitle(createSchema(), undefined, 'view_inherit')).toBe('title');
  });

  test('если у представления своё asTitle true то заголовком становится это свойство а не унаследованное', () => {
    expect(getEffectiveAsTitle(createSchema(), undefined, 'view_own')).toBe('name');
  });
});
