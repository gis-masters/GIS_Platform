import React from 'react';
import { action, observable } from 'mobx';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TextField } from '@mui/material';
import { Agriculture, Biotech, CheckCircleOutline, Clear, DataUsage, ErrorOutline } from '@mui/icons-material';

import '../../../styles.css';
import { FieldType, PropertySchema } from '../../services/crg/schema.models';
import { getDefaultValues, validateFormValue } from '../../services/crg/formValidation.service';
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
  photo: Blob;
  addr: {
    service1: boolean;
    service2: boolean;
    service3: boolean;
    service4: boolean;
  };
  custom: true;
}

const fields: PropertySchema<TestData>[] = [
  {
    fieldType: FieldType.STRING,
    name: 'name',
    title: 'Имя',
    required: true
  },
  {
    fieldType: FieldType.STRING,
    name: 'email',
    title: 'Email',
    wellKnownRegex: 'email'
  },
  {
    fieldType: FieldType.INT,
    name: 'age',
    title: 'Возраст',
    minValue: 18,
    maxValue: 30
  },
  {
    fieldType: FieldType.FLOAT,
    name: 'weight',
    title: 'Вес',
    minValue: 40,
    maxValue: 65
  },
  {
    fieldType: FieldType.BOOL,
    name: 'free',
    title: 'Доступн.',
    defaultValue: true,
    required: true
  },
  {
    fieldType: FieldType.DATETIME,
    name: 'birthDate',
    title: 'Дата рождения',
    required: true
  },
  {
    fieldType: FieldType.CHOICE,
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
    fieldType: FieldType.BINARY,
    name: 'photo',
    title: 'Фото'
  },
  {
    fieldType: FieldType.SET,
    name: 'addr',
    title: 'Адрес',
    defaultValue: { type: 'private' },
    fieldsSet: [
      {
        fieldType: FieldType.STRING,
        name: 'street',
        title: 'Улица'
      },
      {
        fieldType: FieldType.INT,
        name: 'num',
        title: 'Номер дома'
      },
      {
        fieldType: FieldType.CHOICE,
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
    fieldType: FieldType.SET,
    name: 'services',
    title: 'Услуги',
    fieldsSet: [
      {
        fieldType: FieldType.BOOL,
        name: 'service1',
        title: 'Услуга 1'
      },
      {
        fieldType: FieldType.BOOL,
        name: 'service2',
        title: 'Услуга 2'
      },
      {
        fieldType: FieldType.BOOL,
        name: 'service3',
        title: 'Услуга 3'
      },
      {
        fieldType: FieldType.BOOL,
        name: 'service4',
        title: 'Услуга 4'
      }
    ]
  },
  {
    fieldType: FieldType.CUSTOM,
    name: 'custom',
    title: 'Custom',
    defaultValue: true,
    ControlComponent: () => <Agriculture color='error' />
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
  weight: 50,
  free: true,
  birthDate: '2002-01-01',
  color: 'white',
  photo: new Blob(['Hello, world!'], { type: 'text/plain' }),
  addr: {
    service1: true,
    service2: true,
    service3: true,
    service4: true
  },
  custom: true
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

const validate = action(() => {
  errors.splice(0, errors.length, ...validateFormValue<TestData>(value, fields));
});

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const ViewContentOnly = Template.bind({}) as ComponentStory<typeof Form>;
ViewContentOnly.args = {
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
  actions: (
    <>
      <Button color='primary' startIcon={<Biotech />} id='validateData' onClick={validate}>
        Validate
      </Button>
      <Button color='success' startIcon={<CheckCircleOutline />} id='setValidData' onClick={setValidData}>
        Set Valid Data
      </Button>
      <Button color='error' startIcon={<ErrorOutline />} id='setErrorData'>
        Set Error Data
      </Button>
      <Button color='secondary' startIcon={<DataUsage />} id='setDefaultData' onClick={setDefaults}>
        Set Defaults
      </Button>
      <Button color='warning' startIcon={<Clear />} id='clearData' onClick={clearForm}>
        Clear
      </Button>
    </>
  )
};
