import { Given } from '@wdio/cucumber-framework';

import { schemaService } from '../../../src/app/services/data/schema.service';
import { PropertyType, Schema } from '../../../src/app/services/data/schema.models';
import { GeometryType } from '../../../src/app/services/geoserver/wfs.models';
import { convertNewToOldSchema } from '../../../src/app/services/data/schema.utils';
import { authenticateAsAdmin } from './auth/authenticate';

const schemaWithViews: Schema = {
  name: 'border1',
  title: 'Административное деление с представлениями',
  readOnly: false,
  tableName: 'border1',
  properties: [
    {
      name: 'classid',
      title: 'Значение объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Территория населенного пункта',
          value: '601020400'
        },
        {
          title: 'Муниципальный район',
          value: '601020301'
        },
        {
          title: 'Сельское поселение',
          value: '601020307'
        }
      ]
    },
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
      name: 'shape',
      title: 'geometry',
      required: false,
      hidden: false,
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      hidden: false,
      required: true,
      propertyType: PropertyType.FLOAT,
      description: ''
    },
    {
      name: 'STATUS_ADM',
      title: 'Статус объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Существующий',
          value: '1'
        },
        {
          title: 'Планируемый',
          value: '2'
        }
      ]
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
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
          name: 'name',
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
      title: 'Представление 2',
      type: 'VIEW',
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

const schema: Schema = {
  name: 'border2',
  title: 'Административное деление',
  readOnly: false,
  tableName: 'border2',
  properties: [
    {
      name: 'classid',
      title: 'Значение объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Территория населенного пункта',
          value: '601020400'
        },
        {
          title: 'Муниципальный район',
          value: '601020301'
        },
        {
          title: 'Сельское поселение',
          value: '601020307'
        }
      ]
    },
    {
      name: 'shape',
      title: 'geometry',
      required: false,
      hidden: false,
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'name',
      title: 'Наименование объекта',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    },
    {
      name: 'shape_area',
      title: 'Площадь, кв.м',
      hidden: false,
      required: true,
      propertyType: PropertyType.FLOAT,
      description: ''
    },
    {
      name: 'STATUS_ADM',
      title: 'Статус объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Существующий',
          value: '1'
        },
        {
          title: 'Планируемый',
          value: '2'
        }
      ]
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    }
  ],
  description: 'Границы2',
  geometryType: GeometryType.MULTI_POLYGON
};

declare const window: {
  schemaService: typeof schemaService;
  convertNewToOldSchema: typeof convertNewToOldSchema;
};

export async function createSchema(schema: Schema): Promise<void> {
  await authenticateAsAdmin();
  await browser.executeAsync(async (schema, callback) => {
    const parsedSchema = JSON.parse(schema) as Schema;
    try {
      await window.schemaService.getSchema(parsedSchema.name);
    } catch {
      await window.schemaService.createSchema(parsedSchema);
    }

    callback();
  }, JSON.stringify(schema));
}

Given(/^существует заготовленная схема "(.*)" без представлений$/, async (title: string) => {
  schema.name = title;
  schema.tableName = title;

  await createSchema(schema);
});

Given(/^существует заготовленная схема "(.*)" с представлениями$/, async (title: string) => {
  schemaWithViews.name = title;
  schemaWithViews.tableName = title;

  await createSchema(schemaWithViews);
});
