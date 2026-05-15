import { PropertyType, type Relation, type Schema } from '../schema.models';
import { applyContentType } from './applyContentType';

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

const schemaWithAppliedContentType: Schema = {
  name: 'dl_some',
  title: 'тип документа 1',
  appliedContentType: 'doc1',
  tableName: 'dl_some',
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      required: true,
      propertyType: PropertyType.STRING
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

describe('утилита применения типа документа applyContentType', () => {
  test('если выбранного типа документа не существует схема не изменится', () => {
    expect(applyContentType(schemaWithContentTypes, 'doc333')).toStrictEqual(schemaWithContentTypes);
  });

  test('тип документа может быть применён к схеме', () => {
    expect(applyContentType(schemaWithContentTypes, 'doc1')).toStrictEqual(schemaWithAppliedContentType);
  });

  test('в результирующей схеме содержатся только поля, указанные в типе документа', () => {
    const schemaWithAppliedContentType1 = applyContentType(schemaWithContentTypes, 'doc1');
    const propertiesTitles1 = schemaWithAppliedContentType1.properties.map(({ title }) => title);
    expect(propertiesTitles1).toStrictEqual(['Наименование']);

    const schemaWithAppliedContentType2 = applyContentType(schemaWithContentTypes, 'doc2');
    const propertiesTitles2 = schemaWithAppliedContentType2.properties.map(({ title }) => title);
    expect(propertiesTitles2).toStrictEqual(['Площадь, кв.м']);
  });

  test('если в базовой схеме есть relations, а в типе документа нет, то будет использован relations из базовой схемы', () => {
    const relations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    const schemaWithContentTypesAndRelations: Schema = { ...schemaWithContentTypes, relations };
    const schemaWithAppliedContentType1 = applyContentType(schemaWithContentTypesAndRelations, 'doc1');

    expect(schemaWithAppliedContentType1.relations).toStrictEqual(relations);
  });

  test('если в базовой схеме нет relation, а в типе документа есть, то будет использован relation из типа документа', () => {
    const relations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];

    if (!schemaWithContentTypes.contentTypes) {
      throw new Error('А где contentTypes?');
    }

    const schemaWithContentTypesAndRelations: Schema = {
      ...schemaWithContentTypes,
      contentTypes: [{ ...schemaWithContentTypes.contentTypes[0], relations }, schemaWithContentTypes.contentTypes[1]]
    };
    const schemaWithAppliedContentType1 = applyContentType(schemaWithContentTypesAndRelations, 'doc1');

    expect(schemaWithAppliedContentType1.relations).toStrictEqual(relations);
  });

  test('если и в базовой схеме и в типе документа есть relation, то будет использован relation из типа документа', () => {
    const contentTypeRelations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    const schemaRelations: Relation[] = [
      { type: 'document', property: 'title', title: 'Заявления по участку', library: 'dl_other' }
    ];

    if (!schemaWithContentTypes.contentTypes) {
      throw new Error('А где contentTypes?');
    }

    const schemaWithContentTypesAndRelations: Schema = {
      ...schemaWithContentTypes,
      relations: schemaRelations,
      contentTypes: [
        { ...schemaWithContentTypes.contentTypes[0], relations: contentTypeRelations },
        schemaWithContentTypes.contentTypes[1]
      ]
    };
    const schemaWithAppliedContentType1 = applyContentType(schemaWithContentTypesAndRelations, 'doc1');

    expect(schemaWithAppliedContentType1.relations).toStrictEqual(contentTypeRelations);
  });
});
