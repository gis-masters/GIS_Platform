import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import {
  type BasePropertySchema,
  type PropertyOption,
  type PropertySchema,
  PropertyType,
  type SimpleSchema
} from '../../services/data/schema/schema.models';
import { Form } from '../Form/Form';

const cnEditPropertySchemaForm = cn('EditPropertySchemaForm');

const AVAILABLE_PROPERTY_TYPES = [
  PropertyType.STRING,
  PropertyType.TEXT,
  PropertyType.INT,
  PropertyType.FLOAT,
  PropertyType.DATETIME,
  PropertyType.URL,
  PropertyType.USER,
  PropertyType.BOOL
] as const;

type AvailablePropertyType = (typeof AVAILABLE_PROPERTY_TYPES)[number];

const PROPERTY_TYPE_TITLES: Record<AvailablePropertyType, string> = {
  [PropertyType.STRING]: 'Строка',
  [PropertyType.TEXT]: 'Многострочный текст',
  [PropertyType.INT]: 'Целое число',
  [PropertyType.FLOAT]: 'Дробное  число',
  [PropertyType.DATETIME]: 'Дата',
  [PropertyType.URL]: 'Ссылка',
  [PropertyType.USER]: 'Пользователь',
  [PropertyType.BOOL]: 'Логическое значение (Да / Нет)'
};

const propertyTypeOptions: PropertyOption[] = AVAILABLE_PROPERTY_TYPES.map(type => ({
  value: type,
  title: PROPERTY_TYPE_TITLES[type]
}));

function isAvailablePropertyType(value?: PropertyType): value is AvailablePropertyType {
  return AVAILABLE_PROPERTY_TYPES.includes(value as AvailablePropertyType);
}

function getDefaultValuePropertyType(selectedPropertyType?: PropertyType): AvailablePropertyType {
  if (!isAvailablePropertyType(selectedPropertyType)) {
    return PropertyType.STRING;
  }

  return selectedPropertyType;
}

export function getPropertyFieldsSchema(propertyType?: PropertyType, editing = false): SimpleSchema {
  return {
    properties: [
      {
        name: 'name',
        title: 'Идентификатор',
        required: true,
        description: 'Техническое наименование поля в базе данных (пишется латиницей без пробелов)',
        readOnly: !editing,
        propertyType: PropertyType.STRING
      },
      {
        name: 'propertyType',
        title: 'Тип поля',
        description: 'Определяет, какие данные можно будет хранить в этом поле',
        options: propertyTypeOptions,
        readOnly: !editing,
        propertyType: PropertyType.CHOICE
      },
      {
        name: 'title',
        title: 'Наименование',
        description: 'Название поля, отображаемое пользователю',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'description',
        title: 'Описание',
        description: 'Краткое описание назначения поля',
        propertyType: PropertyType.STRING
      },
      {
        name: 'required',
        title: 'Обязательное',
        description: 'Требует обязательного заполнения',
        propertyType: PropertyType.BOOL
      },
      {
        name: 'hidden',
        title: 'Скрытое',
        description: 'Скрывает поле от пользователя',
        propertyType: PropertyType.BOOL
      },
      {
        name: 'readOnly',
        title: 'Только для чтения',
        description: 'Запрещает редактирование значения',
        propertyType: PropertyType.BOOL
      },
      {
        name: 'defaultValue',
        title: 'Значение по умолчанию',
        propertyType: getDefaultValuePropertyType(propertyType)
      }
    ]
  };
}

interface EditPropertySchemaFormProps {
  propertySchema: PropertySchema;
  editing?: boolean;
  propertySchemaWithoutContentType?: PropertySchema;
  onPropertyChange(newPropertySchema: Partial<BasePropertySchema>): void;
}

@observer
export class EditPropertySchemaForm extends Component<EditPropertySchemaFormProps> {
  render() {
    const { propertySchema, editing } = this.props;

    return (
      <Form<Partial<BasePropertySchema>>
        className={cnEditPropertySchemaForm()}
        value={propertySchema}
        onFormChange={this.handleFormChange}
        schema={getPropertyFieldsSchema(propertySchema.propertyType, editing)}
      />
    );
  }

  @boundMethod
  private handleFormChange(value: Partial<BasePropertySchema>) {
    const { onPropertyChange, propertySchema, propertySchemaWithoutContentType } = this.props;

    const nextValue: Partial<BasePropertySchema> = { ...value };

    if (value.propertyType && value.propertyType !== propertySchema.propertyType && 'defaultValue' in nextValue) {
      delete nextValue.defaultValue;
    }

    // чтобы не замусоривать схему дефолтными значениями, удалим их
    const cleanedValue = Object.fromEntries(
      // сейчас все дефолты false
      Object.entries(nextValue).filter(([key, fieldValue]) => {
        if (fieldValue !== undefined) {
          return true;
        }

        return propertySchemaWithoutContentType?.[key as keyof PropertySchema] !== undefined;
      })
    );

    onPropertyChange(cleanedValue);
  }
}
