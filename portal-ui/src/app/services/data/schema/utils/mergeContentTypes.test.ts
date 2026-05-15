import { PropertyType, type Schema } from '../schema.models';
import { mergeContentTypes } from './mergeContentTypes';

const schemaWithContentTypes: Schema = {
  name: 'dl_some',
  title: 'Административное деление',
  tableName: 'dl_some',
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      required: true,
      propertyType: PropertyType.FLOAT
    }
  ],
  contentTypes: [
    {
      id: 'doc1',
      title: 'тип документа 1',
      type: 'DOCUMENT',
      properties: [{ name: 'title', required: true }]
    },
    {
      id: 'doc2',
      title: 'тип документа 2',
      type: 'DOCUMENT',
      properties: [{ name: 'area', title: 'Площадь, кв.м', required: true }]
    }
  ]
};

describe('утилита конвертации нескольких контент типов в один  mergeContentTypes', () => {
  test('в итоговом контент типе содержатся поля из всех переданных контент типов', () => {
    const newContentType = mergeContentTypes(schemaWithContentTypes, ['doc1', 'doc2']);
    expect(newContentType).toStrictEqual({
      id: 'merged__doc1__doc2',
      title: 'Объединённый тип: "doc1", "doc2"',
      type: 'DOCUMENT',
      properties: [
        { name: 'title', required: true },
        { name: 'area', title: 'Площадь, кв.м', required: true }
      ]
    });
  });
});
