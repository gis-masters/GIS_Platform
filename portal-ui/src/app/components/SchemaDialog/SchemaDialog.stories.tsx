import React from 'react';
import { ComponentStory } from '@storybook/react';

import { PropertyType } from '../../services/data/schema/schema.models';
import { GeometryType } from '../../services/geoserver/wfs/wfs.models';

import { SchemaDialog } from './SchemaDialog';

export default {
  title: 'SchemaDialog',
  component: SchemaDialog
};

const Template: ComponentStory<typeof SchemaDialog> = args => <SchemaDialog {...args} />;

export const SchemaDialogPreview = Template.bind({});
SchemaDialogPreview.args = {
  schema: {
    name: 'admemo_123',
    title: 'Территория муниципального образования',
    tableName: 'admemo_123',
    description: 'Класс объектов Территория муниципального образования',
    styleName: 'admemo_123',
    readOnly: true,
    geometryType: GeometryType.MULTI_POLYGON,
    properties: [
      {
        name: 'ruleid',
        title: 'Идентификатор стиля',
        hidden: true,
        calculatedValueWellKnownFormula: 'rule_id_terr_mo_np',
        propertyType: PropertyType.STRING
      },
      {
        name: 'globalid',
        title: 'Идентификатор объекта',
        required: true,
        regex:
          '(urn:uuid:)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|\\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\}',
        propertyType: PropertyType.STRING
      },
      {
        name: 'classid',
        title: 'Код объекта',
        required: true,
        propertyType: PropertyType.CHOICE,
        options: [
          {
            value: '601020301',
            title: 'Муниципальный район'
          },
          {
            value: '601020302',
            title: 'Городской округ'
          },
          {
            value: '601020303',
            title: 'Городской округ с внутригородским делением'
          },
          {
            value: '601020304',
            title: 'Внутригородская территория (внутригородское муниципальное образование) города федерального значения'
          },
          {
            value: '601020305',
            title: 'Внутригородской район'
          },
          {
            value: '601020306',
            title: 'Городское поселение'
          },
          {
            value: '601020307',
            title: 'Сельское поселение'
          }
        ]
      },
      {
        name: 'name',
        title: 'Наименование объекта',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'oktmo',
        title: 'Код ОКТМО',
        required: true,
        regex: '[0-9]{8}|[0-9]{11}',
        minLength: 8,
        maxLength: 11,
        propertyType: PropertyType.STRING
      },
      {
        name: 'population',
        title: 'Численность населения, тыс. чел.',
        propertyType: PropertyType.FLOAT
      },
      {
        name: 'source',
        title: 'Источник данных',
        propertyType: PropertyType.STRING
      },
      {
        name: 'status_adm',
        title: 'Статус объекта административно-территориального деления',
        required: true,
        propertyType: PropertyType.CHOICE,
        options: [
          {
            value: '1',
            title: 'Существующий'
          },
          {
            value: '2',
            title: 'Планируемый'
          }
        ]
      },
      {
        name: 'shape',
        title: 'Геометрия',
        hidden: true,
        propertyType: PropertyType.GEOMETRY
      }
    ]
  }
};
