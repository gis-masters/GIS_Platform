import React from 'react';
import { action, observable } from 'mobx';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TextField } from '@mui/material';
import { Agriculture, Biotech, CheckCircleOutline, Clear, DataUsage, ErrorOutline } from '@mui/icons-material';

import '../../../styles.css';
import { PropertyType, PropertySchema } from '../../services/crg/schema.models';
import { getDefaultValues, validateFormValue } from '../../services/crg/formValidation.service';
import { Mime } from '../../services/util/Mime';
import { Button } from '../Button/Button';

import { Form, FormControl, FormField, FormLabel } from './Form';
import { FormActions } from './Actions/Form-Actions';

export default {
  title: 'Example/Form',
  component: Form
} as ComponentMeta<typeof Form>;

interface TestData extends Record<string, unknown> {
  name: string;
  email: string;
  age: number;
  weight: number;
  free: boolean;
  birthDate: string;
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

const fields: PropertySchema<TestData>[] = [
  {
    propertyType: PropertyType.STRING,
    name: 'name',
    title: 'Имя',
    required: true
  },
  {
    propertyType: PropertyType.STRING,
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
    fieldsSet: [
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
    fieldsSet: [
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
    title: 'Custom',
    defaultValue: true,
    ControlComponent: () => <Agriculture color='error' />,
    ViewComponent: () => <Agriculture color='info' />
  }
];

const value = observable(getDefaultValues(fields));
const errors = observable([]);

const emptyValue: Partial<TestData> = {};
for (const field of fields) {
  emptyValue[field.name] = undefined;
}

const validValue: TestData = {
  name: 'Susan',
  email: 'mail@mail',
  age: 18,
  weight: 50.6,
  free: true,
  birthDate: '2002-01-01',
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
  free: false,
  birthDate: '1002-01-01',
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
  setFormValue(getDefaultValues(fields));
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
  errors.splice(0, errors.length, ...validateFormValue<TestData>(value, fields));
});

const storyActions = (
  <>
    <Button color='primary' startIcon={<Biotech />} id='validateData' onClick={validate}>
      Validate
    </Button>
    <Button color='success' startIcon={<CheckCircleOutline />} id='setValidData' onClick={setValidData}>
      Set Valid Data
    </Button>
    <Button color='error' startIcon={<ErrorOutline />} id='setErrorData' onClick={setErrorData}>
      Set Error Data
    </Button>
    <Button color='secondary' startIcon={<DataUsage />} id='setDefaultData' onClick={setDefaults}>
      Set Defaults
    </Button>
    <Button color='warning' startIcon={<Clear />} id='clearData' onClick={clearForm}>
      Clear
    </Button>
  </>
);

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const ContentOnly = Template.bind({}) as ComponentStory<typeof Form>;
ContentOnly.args = {
  children: (
    <>
      <FormField>
        <FormLabel htmlFor='someTitle'>Название</FormLabel>
        <FormControl>
          <TextField id='someTitle' value={'Some title'} fullWidth variant='standard' />
        </FormControl>
      </FormField>
      <FormField>
        <FormLabel htmlFor='someDescription'>Описание</FormLabel>
        <FormControl>
          <TextField id='someDescription' value={'Some description'} fullWidth variant='standard' />
        </FormControl>
      </FormField>
      <FormActions>
        <Button color='primary'>Отправить</Button>
      </FormActions>
    </>
  )
};

export const OutsideControl = Template.bind({}) as ComponentStory<typeof Form>;
OutsideControl.args = {
  fields: fields as PropertySchema[],
  value,
  onFormChange: setFormValue,
  errors,
  actions: storyActions
};

export const ReadOnly = Template.bind({}) as ComponentStory<typeof Form>;
ReadOnly.args = {
  fields: fields as PropertySchema[],
  value,
  errors,
  readonly: true,
  actions: storyActions
};
