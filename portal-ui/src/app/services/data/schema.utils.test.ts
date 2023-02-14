import { GeometryType } from '../geoserver/wfs.models';
import { PropertyType, Schema } from './schema.models';
import { applyContentType, applyView } from './schema.utils';

const schemaWithViews: Schema = {
  name: 'border1',
  title: 'Административное деление с представлениями',
  readOnly: false,
  tableName: 'border1',
  properties: [
    {
      name: 'name',
      title: 'Наименование',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      hidden: false,
      required: true,
      propertyType: PropertyType.FLOAT,
      description: ''
    }
  ],
  views: [
    {
      id: 'viewsId1',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      title: 'Представление 1',
      type: 'VIEW',
      properties: [
        {
          name: 'name',
          // eslint-disable-next-line sonarjs/no-duplicate-string
          title: 'Наименование объекта',
          hidden: false,
          required: false,
          propertyType: PropertyType.STRING,
          description: ''
        }
      ]
    },
    {
      id: 'viewsId2',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      title: 'Представление 2',
      type: 'VIEW',
      properties: [
        {
          name: 'shape_area',
          // eslint-disable-next-line sonarjs/no-duplicate-string
          title: 'Площадь, кв.м',
          hidden: false,
          required: true,
          propertyType: PropertyType.FLOAT,
          description: ''
        }
      ]
    }
  ],
  description: 'Границы1',
  geometryType: GeometryType.MULTI_POLYGON
};

const schemaWithViewsOutput = {
  name: 'border1',
  title: 'Представление 1',
  readOnly: false,
  tableName: 'border1',
  properties: [
    {
      name: 'name',
      title: 'Наименование объекта',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: 'string',
      description: ''
    }
  ],
  views: [
    {
      id: 'viewsId1',
      title: 'Представление 1',
      type: 'VIEW',
      properties: [
        {
          description: '',
          hidden: false,
          name: 'name',
          propertyType: 'string',
          required: false,
          title: 'Наименование объекта'
        }
      ]
    },
    {
      id: 'viewsId2',
      title: 'Представление 2',
      type: 'VIEW',
      properties: [
        {
          description: '',
          hidden: false,
          name: 'shape_area',
          propertyType: 'float',
          required: true,
          title: 'Площадь, кв.м'
        }
      ]
    }
  ],
  description: 'Границы1',
  geometryType: 'MultiPolygon',
  styleName: undefined,
  children: undefined,
  childOnly: undefined,
  printTemplates: undefined,
  relations: undefined
};

const schemaWithContentTypes: Schema = {
  name: 'border1',
  title: 'Административное деление с представлениями',
  readOnly: false,
  tableName: 'border1',
  properties: [
    {
      name: 'name',
      title: 'Наименование',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      hidden: false,
      required: true,
      propertyType: PropertyType.FLOAT,
      description: ''
    }
  ],
  contentTypes: [
    {
      id: 'contentTypeId1',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      title: 'контент тип 1',
      type: 'CONTENT_TYPE',
      properties: [
        {
          name: 'name',
          // eslint-disable-next-line sonarjs/no-duplicate-string
          title: 'Наименование объекта',
          hidden: false,
          required: false,
          propertyType: PropertyType.STRING,
          description: ''
        }
      ]
    },
    {
      id: 'contentTypeId2',
      title: 'контент тип 2',
      type: 'CONTENT_TYPE',
      properties: [
        {
          name: 'shape_area',
          title: 'Площадь, кв.м',
          hidden: false,
          required: true,
          propertyType: PropertyType.FLOAT,
          description: ''
        }
      ]
    }
  ],
  description: 'Границы1',
  geometryType: GeometryType.MULTI_POLYGON
};

const schemaWithContentTypesOutput = {
  name: 'border1',
  title: 'контент тип 1',
  readOnly: false,
  tableName: 'border1',
  properties: [
    {
      name: 'name',
      title: 'Наименование объекта',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: 'string',
      description: ''
    }
  ],
  contentTypes: [
    {
      id: 'contentTypeId1',
      title: 'контент тип 1',
      type: 'CONTENT_TYPE',
      properties: [
        {
          description: '',
          hidden: false,
          name: 'name',
          propertyType: 'string',
          required: false,
          title: 'Наименование объекта'
        }
      ]
    },
    {
      id: 'contentTypeId2',
      title: 'контент тип 2',
      type: 'CONTENT_TYPE',
      properties: [
        {
          description: '',
          hidden: false,
          name: 'shape_area',
          propertyType: 'float',
          required: true,
          title: 'Площадь, кв.м'
        }
      ]
    }
  ],
  description: 'Границы1',
  geometryType: 'MultiPolygon',
  styleName: undefined,
  children: undefined,
  childOnly: undefined,
  printTemplates: undefined,
  relations: undefined
};

describe('утилита применения представления applyView', () => {
  test('если выбранного представления не существует схема не изменится', () => {
    expect(applyView(schemaWithViews, 'viewsId333')).toStrictEqual(schemaWithViews);
  });

  test('отображаемые поля зависят от выбранного представления', () => {
    expect(applyView(schemaWithViews, 'viewsId1')).toStrictEqual(schemaWithViewsOutput);
  });
});

describe('утилита применения контент типа applyContentType', () => {
  test('если выбранного контент типа не существует схема не изменится', () => {
    expect(applyContentType(schemaWithContentTypes, 'contentTypeId333')).toStrictEqual(schemaWithContentTypes);
  });

  test('отображаемые поля зависят от выбранного контент типа', () => {
    expect(applyContentType(schemaWithContentTypes, 'contentTypeId1')).toStrictEqual(schemaWithContentTypesOutput);
  });
});
