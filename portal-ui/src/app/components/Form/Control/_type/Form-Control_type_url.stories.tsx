import React from 'react';
import { action, observable } from 'mobx';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Biotech } from '@mui/icons-material';

import { PropertySchema, PropertyType } from '../../../../services/data/schema.models';
import { validateFormValue } from '../../../../services/formValidation.service';
import { Form } from '../../Form';
import { sleep } from '../../../../services/util/sleep';
import { Button } from '../../../Button/Button';

export default {
  title: 'Form/Field/url',
  component: Form
} as ComponentMeta<typeof Form>;

interface TestData extends Record<string, unknown> {
  documents: string;
}

const emptyValue: Partial<TestData> = {};

const errors = observable([]);
const errorsField = observable([]);
const emptyField = observable([]);

const testFields: PropertySchema<TestData>[] = [
  {
    propertyType: PropertyType.URL,
    name: 'documents',
    title: 'Пачка документов новое окно',
    openIn: 'newTab',
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Один документ новое окно',
    openIn: 'newTab',
    multiple: false
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Один документ попап',
    openIn: 'popup',
    multiple: false
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Пачка документов попап',
    openIn: 'popup',
    multiple: true
  }
];

const errorTestFields: PropertySchema<TestData>[] = [
  {
    propertyType: PropertyType.URL,
    name: 'requiredDocuments',
    title: 'Обязательные поле с документами',
    openIn: 'popup',
    required: true,
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'errorDocuments',
    title: 'Пачка документов с ошибками',
    openIn: 'newTab',
    wellKnownRegex: 'url',
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'requiredDocuments2',
    title: 'Обязательные поле с документами',
    openIn: 'popup',
    required: true,
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'errorDocuments2',
    title: 'Пачка документов с ошибками',
    openIn: 'newTab',
    wellKnownRegex: 'url',
    multiple: true
  }
];

const emptyFields: PropertySchema<TestData>[] = [
  {
    propertyType: PropertyType.URL,
    name: 'emptyDocuments1',
    title: 'Обязательные пустое поле multiple: true',
    openIn: 'popup',
    required: true,
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'emptyDocuments2',
    title: 'Обязательные пустое поле multiple: false',
    openIn: 'popup',
    required: true,
    multiple: false
  },
  {
    propertyType: PropertyType.URL,
    name: 'emptyDocuments3',
    title: 'Пустое поле multiple: true',
    openIn: 'popup',
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'emptyDocuments4',
    title: 'Пустое поле multiple: false',
    openIn: 'popup',
    multiple: false
  }
];

const value = observable({
  documents: JSON.stringify([
    { url: 'https://www.chaijs.com/api/assert/', text: 'chai' },
    { url: 'https://storybook.js.org/docs/react/get-started/introduction', text: 'storybook' },
    { url: 'https://en.bem.info/methodology/', text: 'not reed' },
    { url: 'text', text: 'text' }
  ]),
  document: JSON.stringify([
    { url: 'http://10.10.10.172/reglaments/Gorodskoi_okrug_Simferopol/GL.html', text: 'regl 1' },
    { url: 'http://10.10.10.172/reglaments/Gorodskoi_okrug_Alushta/SH-1.html', text: 'regl 2' },
    { url: 'text', text: 'text' }
  ]),
  errorDocuments: JSON.stringify([
    { url: 'tttttt', text: 'text' },
    { url: 'http://uuuuuuuuu', text: 'error url' }
  ]),
  emptyDocuments1: '',
  emptyDocuments2: '',
  emptyDocuments3: '',
  emptyDocuments4: ''
} as Record<string, unknown>);

const validate = action(() => {
  errorsField.splice(0, errorsField.length, ...validateFormValue(value, errorTestFields as PropertySchema[]));
});

const validateEmptyFields = action(() => {
  emptyField.splice(0, emptyField.length, ...validateFormValue(value, emptyFields as PropertySchema[]));
});

const actionFunction = async (formValue: TestData) => {
  await sleep(2000 * Math.random());
  const errors = validateFormValue(formValue, testFields as PropertySchema[]);

  if (errors.length) {
    throw { errors };
  }
};

const setFormValue = action((changedValue: Partial<TestData> = {}) => {
  Object.assign(value, emptyValue, changedValue);
});

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const EditableUrl = Template.bind({});
EditableUrl.args = {
  schema: { properties: testFields as PropertySchema[] },
  value,
  errors,
  actionFunction,
  onFormChange: setFormValue
};

export const ReadonlyUrl = Template.bind({});
ReadonlyUrl.args = {
  readonly: true,
  schema: { properties: testFields as PropertySchema[] },
  value,
  errors,
  onFormChange: setFormValue
};

const validateActions = (
  <Button startIcon={<Biotech />} id='validateData' onClick={validate}>
    Validate
  </Button>
);

const validateEmptyFieldsActions = (
  <Button startIcon={<Biotech />} id='validateData' onClick={validateEmptyFields}>
    Validate
  </Button>
);

export const ErrorsUrl = Template.bind({});
ErrorsUrl.args = {
  schema: { properties: errorTestFields as PropertySchema[] },
  value,
  errors: errorsField,
  onFormChange: setFormValue,
  actions: validateActions
};

export const EmptyUrl = Template.bind({});
EmptyUrl.args = {
  schema: { properties: emptyFields as PropertySchema[] },
  value,
  errors: emptyField,
  onFormChange: setFormValue,
  actions: validateEmptyFieldsActions
};

export const ReadOnlyEmptyUrl = Template.bind({});
ReadOnlyEmptyUrl.args = {
  readonly: true,
  schema: { properties: emptyFields as PropertySchema[] },
  value,
  errors: emptyField,
  onFormChange: setFormValue
};
