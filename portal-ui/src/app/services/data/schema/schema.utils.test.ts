/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable sonarjs/no-duplicate-string */

import { Attribute } from '../../geoserver/featureType/featureType.model';
import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { PropertySchema, PropertyType, Relation, Schema } from './schema.models';
import {
  applyContentType,
  applyView,
  convertGeoserverPropertiesToSchemaProperties,
  convertNewToOldProperties,
  convertNewToOldSchema,
  convertOldToNewProperties,
  convertOldToNewSchema,
  mergeContentTypes
} from './schema.utils';
import { OldPropertySchema, OldSchema, ValueType } from './schemaOld.models';

const baseGeoserverAttribute = {
  name: 'baseName',
  binding: 'base.type',
  length: -1,
  minOccurs: -1,
  maxOccurs: -1,
  nillable: false
};

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

const oldSchemaWithLegacyFormulas: OldSchema = {
  name: 'with_legacy_formulas',
  tableName: 'with_legacy_formulas',
  title: 'С устаревшими формулами',
  properties: [
    { name: 'STATUS', title: 'Статус', valueType: ValueType.INT },
    { name: 'REG_STATUS', title: 'Значение', valueType: ValueType.STRING }
  ],
  customRuleFunction:
    "return (obj.status == '3' && !obj.reg_status) ? [{attribute: 'reg_status', error: 'Обязательно'}] : []",
  calcFiledFunction: 'if (!obj.status) obj.status = 0; return obj;'
};

const newSchemaWithLegacyFormulas: Schema = {
  name: 'with_legacy_formulas',
  title: 'С устаревшими формулами',
  tableName: 'with_legacy_formulas',
  properties: [
    { name: 'STATUS', title: 'Статус', propertyType: PropertyType.INT },
    { name: 'REG_STATUS', title: 'Значение', propertyType: PropertyType.STRING }
  ],
  customRuleFunction:
    "return (obj.status == '3' && !obj.reg_status) ? [{attribute: 'reg_status', error: 'Обязательно'}] : []",
  calcFiledFunction: 'if (!obj.status) obj.status = 0; return obj;'
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
    if (!schemaWithViews.views) {
      throw new Error('А где views?');
    }
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

    if (!schemaWithViews.views) {
      throw new Error('А где views?');
    }

    const schemaWithViewsAndRelations: Schema = {
      ...schemaWithViews,
      relations: schemaRelations,
      views: [{ ...schemaWithViews.views[0], relations: viewRelations }, schemaWithViews.views[1]]
    };
    const schemaWithAppliedView1 = applyView(schemaWithViewsAndRelations, 'viewsId1');

    expect(schemaWithAppliedView1.relations).toStrictEqual(viewRelations);
  });

  test('при применении представления к схеме переопределяются поля definitionQuery и styleName', () => {
    expect(applyView(schemaWithViews, 'viewsId3')).toStrictEqual(schemaWithAppliedView3);
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

describe('утилита конвертации схемы из старого формата в новый', () => {
  test('при конвертации схемы не теряются устаревшие формулы', () => {
    expect(convertOldToNewSchema(oldSchemaWithLegacyFormulas)).toStrictEqual(newSchemaWithLegacyFormulas);
  });
});

describe('утилита конвертации схемы из нового формата в старый', () => {
  test('при конвертации схемы не теряются устаревшие формулы', () => {
    expect(convertNewToOldSchema(newSchemaWithLegacyFormulas)).toStrictEqual(oldSchemaWithLegacyFormulas);
  });
});

describe('утилита конвертации свойств схемы из нового формата в старый', () => {
  test('если openIn не указан то он конвертируется в displayMode и принимает значение undefined', () => {
    const newProperties = convertNewToOldProperties([
      {
        name: 'urlField',
        title: 'поле url',
        propertyType: PropertyType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: 'URL',
        displayMode: undefined
      }
    ]);
  });

  test('если openIn: popup то он то он конвертируется в displayMode и принимает значение in_popup', () => {
    const newProperties = convertNewToOldProperties([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'popup',
        propertyType: PropertyType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: 'URL',
        displayMode: 'in_popup'
      }
    ]);
  });

  test('если openIn: newTab то он то он конвертируется в displayMode и принимает значение newTab', () => {
    const newProperties = convertNewToOldProperties([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'newTab',
        propertyType: PropertyType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: 'URL',
        displayMode: 'newTab'
      }
    ]);
  });
});

describe('утилита конвертации свойств схемы из старого формата в новый', () => {
  test('если в свойстве старой схемы не содержится "asTitle", то в новой схеме оно тоже не будет содержаться', () => {
    const oldProperty: OldPropertySchema = {
      name: 'title',
      title: 'Наименование',
      valueType: ValueType.STRING
    };
    const newProperty: PropertySchema = {
      name: 'title',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    };

    expect(convertOldToNewProperties([oldProperty])).toStrictEqual([newProperty]);
  });

  test('если displayMode не указан то он не появится после конвертации', () => {
    const newProperties = convertOldToNewProperties([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: ValueType.URL
      }
    ]);

    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        propertyType: 'url'
      }
    ]);
  });

  test('если openIn: in_popup то он то он конвертируется в displayMode и принимает значение popup', () => {
    const newProperties = convertOldToNewProperties([
      {
        name: 'urlField',
        title: 'поле url',
        displayMode: 'in_popup',
        valueType: ValueType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'popup',
        propertyType: 'url'
      }
    ]);
  });

  test('если openIn: newTab то он то он конвертируется в displayMode и принимает значение newTab', () => {
    const newProperties = convertOldToNewProperties([
      {
        name: 'urlField',
        title: 'поле url',
        displayMode: 'newTab',
        valueType: ValueType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'newTab',
        propertyType: 'url'
      }
    ]);
  });
});

describe('утилита конвертации свойств геосервера в свойства нашей схемы', () => {
  test('Атрибут геосервера с любой геометрией конвертируется как PropertyType.GEOMETRY с title = Геометрия', () => {
    const geoserverAttributes: Attribute[] = [
      {
        ...baseGeoserverAttribute,
        name: 'attributeName',
        binding: 'org.locationtech.jts.geom.Geometry'
      }
    ];

    const geometryProperty: PropertySchema = {
      name: 'attributeName',
      title: 'Геометрия',
      propertyType: PropertyType.GEOMETRY
    };

    expect(convertGeoserverPropertiesToSchemaProperties(geoserverAttributes)).toStrictEqual([geometryProperty]);
  });

  test('Атрибуты BigInteger, Long, Integer конвертируются в PropertyType.INT', () => {
    const geoserverAttributes: Attribute[] = [
      {
        ...baseGeoserverAttribute,
        name: 'attributeBigInteger',
        binding: 'java.math.BigInteger'
      },
      {
        ...baseGeoserverAttribute,
        name: 'attributeLong',
        binding: 'java.lang.Long'
      },
      {
        ...baseGeoserverAttribute,
        name: 'attributeInteger',
        binding: 'java.lang.Integer'
      }
    ];

    const expected: PropertySchema[] = [
      {
        name: 'attributeBigInteger',
        title: 'attributeBigInteger',
        propertyType: PropertyType.INT
      },
      {
        name: 'attributeLong',
        title: 'attributeLong',
        propertyType: PropertyType.INT
      },
      {
        name: 'attributeInteger',
        title: 'attributeInteger',
        propertyType: PropertyType.INT
      }
    ];

    expect(convertGeoserverPropertiesToSchemaProperties(geoserverAttributes)).toStrictEqual(expected);
  });
});
