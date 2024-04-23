/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, test } from '@jest/globals';

import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { GeometryType, WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { FeaturesListItemTitle, getFeaturesListItemTitle } from './FeaturesListItem.util';

const feature: WfsFeature = {
  type: 'Feature',
  id: 'projects_23_dc6e.8',
  geometry: {
    type: GeometryType.MULTI_POLYGON,
    coordinates: [
      [
        [
          [6_596_298.9999, 5_102_780.004],
          [6_603_169.9998, 5_104_910.004]
        ]
      ]
    ]
  },
  geometry_name: 'shape',
  properties: {
    creator: 'Куклина',
    feature_type: '601020301'
  },
  bbox: [6_595_312.9998, 5_086_927.004, 6_613_371.9998, 5_104_910.004]
};

const schema: Schema = {
  name: 'schemaWithoutViews',
  title: 'Административное деление',
  readOnly: false,
  tableName: 'border2',
  styleName: 'admemo',
  properties: [],
  description: 'Границы2',
  geometryType: GeometryType.MULTI_POLYGON
};

describe('утилита получение заголовка', () => {
  test('если asTitle: true указан для поля не являющемся PropertyType.CHOICE то функция getFeaturesListItemTitle берет заголовок по property.name поля', () => {
    schema.properties = [
      {
        name: 'name',
        title: 'Наименование объекта',
        propertyType: PropertyType.STRING
      },
      {
        name: 'creator',
        title: 'Создатель',
        asTitle: true,
        propertyType: PropertyType.STRING
      }
    ];

    const output: FeaturesListItemTitle = { title: 'Куклина', isEmpty: false };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });

  test('если asTitle: true указан для поля в котором есть property.options то функция getFeaturesListItemTitle берет заголовок из имеющихся опций', () => {
    schema.properties = [
      {
        name: 'feature_type',
        title: 'Значение объекта',
        asTitle: true,
        propertyType: PropertyType.CHOICE,
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
        title: 'Наименование объекта',
        propertyType: PropertyType.STRING
      }
    ];

    const output: FeaturesListItemTitle = { title: 'Муниципальный район', isEmpty: false };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });

  test('если asTitle: true указан для поля в котором есть property.options но нет нужной опции то функция getFeaturesListItemTitle возвращает строку "не заполнено"', () => {
    schema.properties = [
      {
        name: 'feature_type',
        title: 'Значение объекта',
        propertyType: PropertyType.CHOICE,
        options: [
          {
            title: 'Территория населенного пункта',
            value: '601020400'
          },
          {
            title: 'Сельское поселение',
            value: '601020307'
          }
        ]
      },
      {
        name: 'creator',
        title: 'Создатель',
        asTitle: true,
        propertyType: PropertyType.STRING
      }
    ];

    feature.properties.creator = '';
    const output: FeaturesListItemTitle = { title: 'не заполнено', isEmpty: true };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });

  test('если указан asTitle но у объекта это поле не заполнено то функция getFeaturesListItemTitle возвращает строку "не заполнено"', () => {
    schema.properties = [
      {
        name: 'feature_type',
        title: 'Значение объекта',
        propertyType: PropertyType.CHOICE,
        options: [
          {
            title: 'Территория населенного пункта',
            value: '601020400'
          },
          {
            title: 'Сельское поселение',
            value: '601020307'
          }
        ]
      },
      {
        name: 'creator',
        title: 'Создатель',
        asTitle: true,
        propertyType: PropertyType.STRING
      }
    ];

    feature.properties.creator = '';

    const output: FeaturesListItemTitle = { title: 'не заполнено', isEmpty: true };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });

  test('если asTitle не указан то функция getFeaturesListItemTitle возвращает значение поля "name" у объекта', () => {
    schema.properties = [
      {
        name: 'feature_type',
        title: 'Значение объекта',
        propertyType: PropertyType.CHOICE,
        options: [
          {
            title: 'Территория населенного пункта',
            value: '601020400'
          },
          {
            title: 'Сельское поселение',
            value: '601020307'
          }
        ]
      },
      {
        name: 'creator',
        title: 'Создатель',
        propertyType: PropertyType.STRING
      }
    ];

    feature.properties.title = '';
    feature.properties.name = 'Яснополянское поселение';

    const output: FeaturesListItemTitle = { title: 'Яснополянское поселение', isEmpty: false };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });

  test('если asTitle не указан то функция getFeaturesListItemTitle возвращает значение поля "title" у объекта', () => {
    schema.properties = [
      {
        name: 'feature_type',
        title: 'Значение объекта',
        propertyType: PropertyType.CHOICE,
        options: [
          {
            title: 'Территория населенного пункта',
            value: '601020400'
          },
          {
            title: 'Сельское поселение',
            value: '601020307'
          }
        ]
      },
      {
        name: 'creator',
        title: 'Создатель',
        propertyType: PropertyType.STRING
      }
    ];

    feature.properties.name = '';
    feature.properties.title = 'Яснополянское сельское';

    const output: FeaturesListItemTitle = { title: 'Яснополянское сельское', isEmpty: false };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });

  test('если asTitle не указан и у объекта нет полей "name" и "title" то функция getFeaturesListItemTitle возвращает строку "объект"', () => {
    schema.properties = [
      {
        name: 'feature_type',
        title: 'Значение объекта',
        propertyType: PropertyType.CHOICE,
        options: [
          {
            title: 'Территория населенного пункта',
            value: '601020400'
          },
          {
            title: 'Сельское поселение',
            value: '601020307'
          }
        ]
      },
      {
        name: 'creator',
        title: 'Создатель',
        propertyType: PropertyType.STRING
      }
    ];

    feature.properties.name = '';
    feature.properties.title = '';

    const output: FeaturesListItemTitle = { title: 'объект', isEmpty: true };
    const titles = getFeaturesListItemTitle(feature, schema);

    expect(titles).toStrictEqual(output);
  });
});
