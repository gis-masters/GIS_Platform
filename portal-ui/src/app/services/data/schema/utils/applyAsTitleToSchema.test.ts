import { describe, expect, test } from '@jest/globals';

import { PropertyType, type Schema } from '../schema.models';
import { applyAsTitleToSchema } from './applyAsTitleToSchema';

const createSchema = (): Schema => ({
  name: 'as_title_schema',
  title: 'asTitle',
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
    },
    {
      name: 'code',
      title: 'Код',
      propertyType: PropertyType.INT
    }
  ],
  views: [
    {
      id: 'view_a',
      type: 'VIEW',
      title: 'View A',
      properties: [{ name: 'title' }, { name: 'name' }]
    },
    {
      id: 'view_b',
      type: 'VIEW',
      title: 'View B',
      properties: [{ name: 'title' }, { name: 'code' }]
    }
  ],
  contentTypes: [
    {
      id: 'ct_a',
      type: 'DOCUMENT',
      title: 'CT A',
      properties: [{ name: 'title' }, { name: 'name' }]
    },
    {
      id: 'ct_b',
      type: 'DOCUMENT',
      title: 'CT B',
      properties: [{ name: 'title' }, { name: 'code' }]
    }
  ]
});

describe('утилита применения asTitle к схеме applyAsTitleToSchema', () => {
  test('если fieldName указан без представления и типа документа то у выбранного свойства схемы asTitle равен true', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, 'name');

    expect(nextSchema.properties.find(property => property.name === 'name')?.asTitle).toBe(true);
  });

  test('если fieldName указан без представления и типа документа то у остальных свойств схемы ключ asTitle отсутствует', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, 'name');

    expect(nextSchema.properties.find(property => property.name === 'title')?.asTitle).toBeUndefined();
    expect(nextSchema.properties.find(property => property.name === 'code')?.asTitle).toBeUndefined();
  });

  test('если fieldName не указан без представления и типа документа то у всех свойств схемы ключ asTitle отсутствует', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema);

    expect(nextSchema.properties.every(property => property.asTitle === undefined)).toBe(true);
  });

  test('если у свойства схемы asTitle равен false то ключ asTitle удаляется', () => {
    const schema = createSchema();
    schema.properties = schema.properties.map(property =>
      property.name === 'name' ? { ...property, asTitle: false } : property
    );

    const nextSchema = applyAsTitleToSchema(schema, 'title');

    expect(nextSchema.properties.find(property => property.name === 'name')?.asTitle).toBeUndefined();
  });

  test('если указан viewId то свойства схемы не изменяются', () => {
    const schema = createSchema();
    const originalProperties = schema.properties;
    const nextSchema = applyAsTitleToSchema(schema, 'name', undefined, 'view_a');

    expect(nextSchema.properties).toStrictEqual(originalProperties);
  });

  test('если указан viewId и fieldName то у выбранного свойства этого представления asTitle равен true', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, 'name', undefined, 'view_a');

    expect(
      nextSchema.views?.find(view => view.id === 'view_a')?.properties.find(property => property.name === 'name')
        ?.asTitle
    ).toBe(true);
  });

  test('если указан viewId и fieldName то у остальных свойств этого представления asTitle не равен true', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, 'name', undefined, 'view_a');
    const viewProperties = nextSchema.views?.find(view => view.id === 'view_a')?.properties ?? [];

    expect(
      viewProperties.filter(property => property.name !== 'name').every(property => property.asTitle !== true)
    ).toBe(true);
  });

  test('если указан viewId и fieldName не указан то у свойств этого представления asTitle не равен true', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, undefined, undefined, 'view_a');
    const viewProperties = nextSchema.views?.find(view => view.id === 'view_a')?.properties ?? [];

    expect(viewProperties.every(property => property.asTitle !== true)).toBe(true);
  });

  test('если свойство представления унаследует asTitle true из схемы и это свойство не выбрано заголовком то в представление записывается asTitle false', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, 'name', undefined, 'view_a');

    expect(
      nextSchema.views?.find(view => view.id === 'view_a')?.properties.find(property => property.name === 'title')
        ?.asTitle
    ).toBe(false);
  });

  test('если у свойства представления asTitle равен false и схема не задаёт asTitle true для этого свойства то ключ asTitle удаляется', () => {
    const schema = createSchema();
    schema.views = schema.views?.map(view =>
      view.id === 'view_a'
        ? {
            ...view,
            properties: view.properties.map(property =>
              property.name === 'name' ? { ...property, asTitle: false } : property
            )
          }
        : view
    );

    const nextSchema = applyAsTitleToSchema(schema, 'title', undefined, 'view_a');

    expect(
      nextSchema.views?.find(view => view.id === 'view_a')?.properties.find(property => property.name === 'name')
        ?.asTitle
    ).toBeUndefined();
  });

  test('если указан viewId то остальные представления не изменяются', () => {
    const schema = createSchema();
    const otherView = schema.views?.find(view => view.id === 'view_b');
    const nextSchema = applyAsTitleToSchema(schema, 'name', undefined, 'view_a');

    expect(nextSchema.views?.find(view => view.id === 'view_b')).toStrictEqual(otherView);
  });

  test('если указан contentTypeId то asTitle применяется только к свойствам этого типа документа', () => {
    const schema = createSchema();
    const originalProperties = schema.properties;
    const otherContentType = schema.contentTypes?.find(contentType => contentType.id === 'ct_b');
    const nextSchema = applyAsTitleToSchema(schema, 'name', 'ct_a');

    expect(nextSchema.properties).toStrictEqual(originalProperties);
    expect(nextSchema.contentTypes?.find(contentType => contentType.id === 'ct_b')).toStrictEqual(otherContentType);
    expect(
      nextSchema.contentTypes
        ?.find(contentType => contentType.id === 'ct_a')
        ?.properties.find(property => property.name === 'name')?.asTitle
    ).toBe(true);
  });

  test('если указан contentTypeId и fieldName не указан то asTitle снимается со свойств этого типа документа', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, undefined, 'ct_a');
    const contentTypeProperties =
      nextSchema.contentTypes?.find(contentType => contentType.id === 'ct_a')?.properties ?? [];

    expect(contentTypeProperties.every(property => property.asTitle !== true)).toBe(true);
  });

  test('если свойство типа документа унаследует asTitle true из схемы и это свойство не выбрано заголовком то в тип документа записывается asTitle false', () => {
    const schema = createSchema();
    const nextSchema = applyAsTitleToSchema(schema, 'name', 'ct_a');

    expect(
      nextSchema.contentTypes
        ?.find(contentType => contentType.id === 'ct_a')
        ?.properties.find(property => property.name === 'title')?.asTitle
    ).toBe(false);
  });

  test('если у свойства типа документа asTitle равен false и схема не задаёт asTitle true для этого свойства то ключ asTitle удаляется', () => {
    const schema = createSchema();
    schema.contentTypes = schema.contentTypes?.map(contentType =>
      contentType.id === 'ct_a'
        ? {
            ...contentType,
            properties: contentType.properties.map(property =>
              property.name === 'name' ? { ...property, asTitle: false } : property
            )
          }
        : contentType
    );

    const nextSchema = applyAsTitleToSchema(schema, 'title', 'ct_a');

    expect(
      nextSchema.contentTypes
        ?.find(contentType => contentType.id === 'ct_a')
        ?.properties.find(property => property.name === 'name')?.asTitle
    ).toBeUndefined();
  });
});
