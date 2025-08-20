import React from 'react';
import { action, observable } from 'mobx';
import { TextField } from '@mui/material';
import { Agriculture, Biotech, CheckCircleOutline, Clear, DataUsage, ErrorOutline, Send } from '@mui/icons-material';
import { StoryFn } from '@storybook/react';
import { cloneDeep } from 'lodash';

import { PropertySchema, PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { FieldErrors, validateFormValue } from '../../services/util/form/formValidation.utils';
import { Mime } from '../../services/util/Mime';
import { sleep } from '../../services/util/sleep';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { Button } from '../Button/Button';
import { cnFormStoryActions, FormStoryActions } from '../FormStoryActions/FormStoryActions';
import { Toast } from '../Toast/Toast';
import { FormActions } from './Actions/Form-Actions';
import { cnFormControl } from './Control/Form-Control';
import { Form, FormField, FormLabel } from './Form';
import { getDefaultValues } from './Form.utils';

export default {
  title: 'Form',
  component: Form
};

interface TestData {
  name: string;
  email: string;
  age: number;
  weight: number;
  size: number;
  free: boolean;
  birthDate: string;
  about: string;
  color: string;
  photo: File;
  addr: {
    street?: string;
    num?: string;
    type?: string;
  };
  services: {
    service1?: boolean;
    service2?: boolean;
    service3?: boolean;
    service4?: boolean;
  };
  custom: boolean;
}

const testFields: PropertySchema[] = [
  {
    propertyType: PropertyType.STRING,
    name: 'name',
    title: 'Имя',
    required: true
  },
  {
    propertyType: PropertyType.STRING,
    description: 'Там точно должна быть собака',
    name: 'email',
    title: 'Email',
    wellKnownRegex: 'email'
  },
  {
    propertyType: PropertyType.INT,
    name: 'age',
    title: 'Возраст',
    minValue: 18,
    maxValue: 30
  },
  {
    propertyType: PropertyType.FLOAT,
    name: 'weight',
    title: 'Вес',
    minValue: 40,
    maxValue: 65,
    precision: 1
  },
  {
    propertyType: PropertyType.INT,
    display: 'slider',
    name: 'size',
    title: 'Размер',
    minValue: 0,
    maxValue: 7,
    defaultValue: 3,
    required: true
  },
  {
    propertyType: PropertyType.BOOL,
    name: 'free',
    title: 'Доступн.',
    defaultValue: true,
    required: true
  },
  {
    propertyType: PropertyType.DATETIME,
    name: 'birthDate',
    title: 'Дата рождения',
    required: true,
    minValue: '2000-01-01'
  },
  {
    propertyType: PropertyType.STRING,
    display: 'multiline',
    name: 'about',
    title: 'О себе',
    minLength: 120
  },
  {
    propertyType: PropertyType.CHOICE,
    name: 'color',
    title: 'Цвет',
    defaultValue: 'white',
    options: [
      { title: 'Белый', value: 'white' },
      { title: 'Чёрный', value: 'black' },
      { title: 'Жёлтый', value: 'yellow' }
    ]
  },
  {
    propertyType: PropertyType.BINARY,
    name: 'photo',
    title: 'Фото'
  },
  {
    propertyType: PropertyType.SET,
    name: 'addr',
    title: 'Адрес',
    defaultValue: { type: 'private' },
    properties: [
      {
        propertyType: PropertyType.STRING,
        name: 'street',
        title: 'Улица'
      },
      {
        propertyType: PropertyType.INT,
        name: 'num',
        title: 'Номер дома'
      },
      {
        propertyType: PropertyType.CHOICE,
        name: 'type',
        title: 'Тип строения',
        options: [
          {
            title: 'Частный дом',
            value: 'private'
          },
          {
            title: 'Офис',
            value: 'office'
          }
        ]
      }
    ]
  },
  {
    propertyType: PropertyType.SET,
    name: 'services',
    title: 'Услуги',
    properties: [
      {
        propertyType: PropertyType.BOOL,
        name: 'service1',
        title: 'Услуга 1'
      },
      {
        propertyType: PropertyType.BOOL,
        name: 'service2',
        title: 'Услуга 2'
      },
      {
        propertyType: PropertyType.BOOL,
        name: 'service3',
        title: 'Услуга 3'
      },
      {
        propertyType: PropertyType.BOOL,
        name: 'service4',
        title: 'Услуга 4'
      }
    ]
  },
  {
    propertyType: PropertyType.CUSTOM,
    name: 'custom',
    title: 'Custom field with very long title to see how the label looks with a linebreak and description together',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    defaultValue: true,
    ControlComponent: () => <Agriculture color='error' />,
    ViewComponent: () => <Agriculture color='info' />
  }
];

const value = observable(getDefaultValues(testFields));
const errors = observable<FieldErrors>([]);

const emptyValue: Partial<TestData> = {};
for (const field of testFields) {
  emptyValue[field.name as keyof TestData] = undefined;
}

const validValue: TestData = {
  name: 'Susan',
  email: 'mail@mail',
  age: 18,
  weight: 50.6,
  size: 5,
  free: true,
  birthDate: '2002-01-01',
  about:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',

  color: 'white',
  photo: new File(['Hello, world!'], 'filename.txt', { type: Mime.TEXT }),
  addr: {
    num: '3',
    street: 'Zzzz',
    type: 'private'
  },
  services: {
    service1: true,
    service2: true,
    service3: true,
    service4: true
  },
  custom: true
};

const errorValue: TestData = {
  name: '',
  email: 'zzz',
  age: 18.8,
  weight: 10.88,
  size: 8,
  free: false,
  birthDate: '1002-01-01',
  about: 'ыц',
  color: 'brown',
  photo: new File(['Hello, world!'], 'filename.txt', { type: Mime.TEXT }),
  addr: {},
  services: {
    service1: false,
    service2: false,
    service3: false,
    service4: false
  },
  custom: false
};

const setFormValue = action((changedValue: Partial<TestData> = {}) => {
  Object.assign(value, emptyValue, changedValue);
});

function setDefaults() {
  setFormValue(getDefaultValues(testFields));
}

function clearForm() {
  setFormValue();
}

function setValidData() {
  setFormValue(validValue);
}

function setErrorData() {
  setFormValue(errorValue);
}

const validate = action(() => {
  errors.splice(0, errors.length, ...validateFormValue(value, testFields));
});

const actionFunction = async (formValue: TestData) => {
  await sleep(2000 * Math.random());
  const errors = validateFormValue(formValue, testFields);

  if (errors.length) {
    throw { errors };
  }
};

const storyActions = (
  <FormStoryActions>
    <Button startIcon={<Biotech />} className={cnFormStoryActions('ValidateData')} onClick={validate}>
      Validate
    </Button>
    <Button
      color='success'
      startIcon={<CheckCircleOutline />}
      className={cnFormStoryActions('SetValidData')}
      onClick={setValidData}
    >
      Set Valid Data
    </Button>
    <Button
      color='error'
      startIcon={<ErrorOutline />}
      className={cnFormStoryActions('SetErrorData')}
      onClick={setErrorData}
    >
      Set Error Data
    </Button>
    <Button
      color='secondary'
      startIcon={<DataUsage />}
      className={cnFormStoryActions('SetDefaultData')}
      onClick={setDefaults}
    >
      Set Defaults
    </Button>
    <Button color='warning' startIcon={<Clear />} className={cnFormStoryActions('ClearData')} onClick={clearForm}>
      Clear
    </Button>
  </FormStoryActions>
);

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const ContentOnly = Template.bind({});
ContentOnly.args = {
  children: (
    <>
      <FormField>
        <FormLabel htmlFor='someTitle'>Название</FormLabel>
        <div className={cnFormControl()}>
          <TextField id='someTitle' value={'Some title'} fullWidth variant='standard' />
        </div>
      </FormField>
      <FormField>
        <FormLabel htmlFor='someDescription'>Описание</FormLabel>
        <div className={cnFormControl()}>
          <TextField id='someDescription' value={'Some description'} fullWidth variant='standard' />
        </div>
      </FormField>
      <FormActions>
        <Button color='primary'>Отправить</Button>
      </FormActions>
    </>
  )
};

export const OutsideControl = Template.bind({});
OutsideControl.args = {
  schema: { properties: testFields },
  value,
  onFormChange: setFormValue,
  errors,
  actions: storyActions
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  schema: { properties: testFields },
  value,
  errors,
  readonly: true,
  actions: storyActions
};

export const Auto = Template.bind({});
Auto.args = {
  id: 'autoForm',
  auto: true,
  schema: { properties: testFields },
  value,
  actionFunction,
  onActionSuccess() {
    Toast.success('Success!');
  },
  onActionError() {
    Toast.warn('Error!');
  },
  actions: (
    <>
      <Button form='autoForm' type='submit' startIcon={<Send />} color='primary'>
        Send
      </Button>
      {storyActions}
    </>
  )
};

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

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  id: 'defaultValue',
  schema: schemaWithDefaultValue,
  value: getDefaultValues(schemaWithDefaultValue.properties, { surname: 'Doe' })
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

const currentSchemaWithDynamicProperties: SimpleSchema = cloneDeep(schemaWithDynamicProperties);
currentSchemaWithDynamicProperties.properties[0] = {
  ...currentSchemaWithDynamicProperties.properties[0],
  dynamicPropertyFormula: obj => ({ required: !(isRecordStringUnknown(obj) && !!obj.name) })
};

const validateDynamicProperties = action(() => {
  errors.splice(0, errors.length, ...validateFormValue(value, testFields));
});

const dynamicPropertiesStoryActions = (
  <FormStoryActions>
    <Button startIcon={<Biotech />} className={cnFormStoryActions('ValidateData')} onClick={validateDynamicProperties}>
      Validate
    </Button>
  </FormStoryActions>
);

export const DynamicProperties = Template.bind({});
DynamicProperties.args = {
  id: 'dynamicProperty',
  schema: currentSchemaWithDynamicProperties,
  actions: dynamicPropertiesStoryActions,
  actionFunction,
  errors,
  value: getDefaultValues(schemaWithDynamicProperties.properties)
};
