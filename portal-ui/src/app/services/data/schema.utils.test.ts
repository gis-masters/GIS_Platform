/* eslint-disable sonarjs/no-duplicate-string */
import { GeometryType } from '../geoserver/wfs.models';
import { PropertyType, Relation, Schema } from './schema.models';
import { applyContentType, applyView } from './schema.utils';

const schemaWithViews: Schema = {
  name: 'border1',
  title: 'Административное деление с представлениями',
  tableName: 'border1',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      propertyType: PropertyType.FLOAT
    }
  ],
  views: [
    {
      id: 'viewsId1',
      title: 'Представление 1',
      type: 'VIEW',
      properties: [{ name: 'title' }]
    },
    {
      id: 'viewsId2',
      title: 'Представление 2',
      type: 'VIEW',
      properties: [{ name: 'shape_area', required: true }]
    }
  ]
};

const schemaWithAppliedView1: Schema = {
  name: 'border1',
  title: 'Представление 1',
  tableName: 'border1',
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      required: true,
      propertyType: PropertyType.STRING
    }
  ],
  geometryType: GeometryType.MULTI_POLYGON
};

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
  tableName: 'dl_some',
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      required: true,
      propertyType: PropertyType.STRING
    }
  ]
};

describe('утилита применения представления applyView', () => {
  test('если выбранного представления не существует схема не изменится', () => {
    expect(applyView(schemaWithViews, 'viewsId333')).toStrictEqual(schemaWithViews);
  });

  test('представление может быть применено к схеме', () => {
    expect(applyView(schemaWithViews, 'viewsId1')).toStrictEqual(schemaWithAppliedView1);
  });

  test('в результирующей схеме содержатся только поля, указанные в представлении', () => {
    const schemaWithAppliedView1 = applyView(schemaWithViews, 'viewsId1');
    const propertiesTitles1 = schemaWithAppliedView1.properties.map(({ title }) => title);
    expect(propertiesTitles1).toStrictEqual(['Наименование']);

    const schemaWithAppliedView2 = applyView(schemaWithViews, 'viewsId2');
    const propertiesTitles2 = schemaWithAppliedView2.properties.map(({ title }) => title);
    expect(propertiesTitles2).toStrictEqual(['Площадь']);
  });

  test('если в базовой схеме есть relations, а в представлении нет, то будет использован relations из базовой схемы', () => {
    const relations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    const schemaWithViewsAndRelations: Schema = { ...schemaWithViews, relations };
    const schemaWithAppliedView1 = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1.relations).toStrictEqual(relations);
  });

  test('если в базовой схеме нет relation, а в представлении есть, то будет использован relation из представления', () => {
    const relations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    const schemaWithViewsAndRelations: Schema = {
      ...schemaWithViews,
      views: [{ ...schemaWithViews.views[0], relations }, schemaWithViews.views[1]]
    };
    const schemaWithAppliedView1 = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1.relations).toStrictEqual(relations);
  });

  test('если и в базовой схеме и в представлении есть relation, то будет использован relation из представления', () => {
    const viewRelations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    const schemaRelations: Relation[] = [
      { type: 'document', property: 'title', title: 'Заявления по участку', library: 'dl_other' }
    ];
    const schemaWithViewsAndRelations: Schema = {
      ...schemaWithViews,
      relations: schemaRelations,
      views: [{ ...schemaWithViews.views[0], relations: viewRelations }, schemaWithViews.views[1]]
    };
    const schemaWithAppliedView1 = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1.relations).toStrictEqual(viewRelations);
  });
});

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
