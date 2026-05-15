import { GeometryType } from '../../../geoserver/wfs/wfs.models';
import { PropertyType, type Relation, type Schema } from '../schema.models';
import { applyView } from './applyView';

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
      asTitle: true,
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
    },
    {
      id: 'viewsId3',
      title: 'Представление 3',
      type: 'VIEW',
      styleName: 'borderLine',
      definitionQuery: 'shape_area > 20000',
      properties: [{ name: 'title' }]
    }
  ]
};

const schemaWithAppliedView1: Schema = {
  name: 'border1',
  appliedView: 'viewsId1',
  title: 'Представление 1',
  tableName: 'border1',
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      required: true,
      asTitle: true,
      propertyType: PropertyType.STRING
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
    },
    {
      id: 'viewsId3',
      title: 'Представление 3',
      type: 'VIEW',
      styleName: 'borderLine',
      definitionQuery: 'shape_area > 20000',
      properties: [{ name: 'title' }]
    }
  ],
  geometryType: GeometryType.MULTI_POLYGON
};

const schemaWithAppliedView3: Schema = {
  name: 'border1',
  appliedView: 'viewsId3',
  title: 'Представление 3',
  tableName: 'border1',
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      required: true,
      asTitle: true,
      propertyType: PropertyType.STRING
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
    },
    {
      id: 'viewsId3',
      title: 'Представление 3',
      type: 'VIEW',
      styleName: 'borderLine',
      definitionQuery: 'shape_area > 20000',
      properties: [{ name: 'title' }]
    }
  ],
  geometryType: GeometryType.MULTI_POLYGON,
  styleName: 'borderLine',
  definitionQuery: 'shape_area > 20000'
};

describe('утилита применения представления applyView', () => {
  test('если выбранного представления не существует схема не изменится', () => {
    expect(applyView(schemaWithViews, 'viewsId333')).toStrictEqual(schemaWithViews);
  });

  test('представление может быть применено к схеме', () => {
    expect(applyView(schemaWithViews, 'viewsId1')).toStrictEqual(schemaWithAppliedView1);
  });

  test('в результирующей схеме содержатся только поля, указанные в представлении', () => {
    const schemaWithAppliedView1Local = applyView(schemaWithViews, 'viewsId1');
    const propertiesTitles1 = schemaWithAppliedView1Local.properties.map(({ title }) => title);
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
    const schemaWithAppliedView1Local = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1Local.relations).toStrictEqual(relations);
  });

  test('если в базовой схеме нет relation, а в представлении есть, то будет использован relation из представления', () => {
    const relations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    if (!schemaWithViews.views) {
      throw new Error('А где views?');
    }
    const schemaWithViewsAndRelations: Schema = {
      ...schemaWithViews,
      views: [{ ...schemaWithViews.views[0], relations }, schemaWithViews.views[1]]
    };
    const schemaWithAppliedView1Local = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1Local.relations).toStrictEqual(relations);
  });

  test('если и в базовой схеме и в представлении есть relation, то будет использован relation из представления', () => {
    const viewRelations: Relation[] = [
      { type: 'document', property: 'title', title: 'Документы по участку', library: 'dl_some' }
    ];
    const schemaRelations: Relation[] = [
      { type: 'document', property: 'title', title: 'Заявления по участку', library: 'dl_other' }
    ];

    if (!schemaWithViews.views) {
      throw new Error('А где views?');
    }

    const schemaWithViewsAndRelations: Schema = {
      ...schemaWithViews,
      relations: schemaRelations,
      views: [{ ...schemaWithViews.views[0], relations: viewRelations }, schemaWithViews.views[1]]
    };
    const schemaWithAppliedView1Local = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1Local.relations).toStrictEqual(viewRelations);
  });

  test('при применении представления к схеме переопределяются поля definitionQuery и styleName', () => {
    expect(applyView(schemaWithViews, 'viewsId3')).toStrictEqual(schemaWithAppliedView3);
  });
});
