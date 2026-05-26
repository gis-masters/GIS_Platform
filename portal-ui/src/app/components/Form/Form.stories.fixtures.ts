import { PropertyType, type SimpleSchema } from '../../services/data/schema/schema.models';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';

export const schemaWithDefaultValue: SimpleSchema = {
  properties: [
    {
      name: 'name',
      title: 'Имя',
      propertyType: PropertyType.STRING,
      defaultValue: 'John'
    },
    {
      name: 'surname',
      title: 'Фамилия',
      propertyType: PropertyType.STRING,
      defaultValueWellKnownFormula: 'inherit'
    },
    {
      name: 'initials',
      title: 'Инициалы',
      propertyType: PropertyType.STRING,
      defaultValueFormula: 'return obj.name.slice(0,1) + ". " + parent.surname.slice(0,1) + "."'
    }
  ]
};

export const schemaWithDynamicProperties: SimpleSchema = {
  properties: [
    {
      name: 'name',
      title: 'Название',
      propertyType: PropertyType.STRING
    },
    {
      name: 'caption',
      title: 'Надпись',
      description:
        'Тут формула динамического свойства указана строкой. Изменяется title в зависимости от значения поля "Название".',
      propertyType: PropertyType.STRING,
      dynamicPropertyFormula: 'return { title: "Надпись" + (obj?.name ? " на " + obj?.name : "") }'
    },
    {
      name: 'hasDescription',
      title: 'Есть описание',
      description: 'Если включить, то станет видимым ещё одно поле.',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'description',
      title: 'Описание',
      description:
        'Тут формула динамического свойства указана функцией. Изменяется hidden в зависимости от значения поля "Есть описание".',
      propertyType: PropertyType.STRING,
      dynamicPropertyFormula: obj => ({ hidden: !(isRecordStringUnknown(obj) && obj.hasDescription) })
    }
  ]
};
