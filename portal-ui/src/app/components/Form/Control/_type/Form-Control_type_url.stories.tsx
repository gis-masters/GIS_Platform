import React from 'react';
import { action, IObservableArray, observable } from 'mobx';
import { Biotech } from '@mui/icons-material';
import { StoryFn } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/data/schema/schema.models';
import { FieldErrors, validateFormValue } from '../../../../services/util/form/formValidation.utils';
import { sleep } from '../../../../services/util/sleep';
import { Button } from '../../../Button/Button';
import { cnFormStoryActions, FormStoryActions } from '../../../FormStoryActions/FormStoryActions';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/url',
  component: Form
};

interface TestData extends Record<string, unknown> {
  documents: string;
}

const emptyValue: Partial<TestData> = {};

const errors = observable([]);
const errorsField: IObservableArray<FieldErrors> = observable<FieldErrors>([]);
const emptyField: IObservableArray<FieldErrors> = observable<FieldErrors>([]);

const testFields: PropertySchema[] = [
  {
    propertyType: PropertyType.URL,
    name: 'documents',
    title: 'Пачка ссылок, новое окно',
    openIn: 'newTab',
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Одна ссылка, новое окно',
    openIn: 'newTab',
    multiple: false
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Одна ссылка, не указан openIn',
    multiple: false
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Одна ссылка, попап',
    openIn: 'popup',
    multiple: false
  },
  {
    propertyType: PropertyType.URL,
    name: 'document',
    title: 'Пачка ссылок, попап',
    openIn: 'popup',
    multiple: true
  }
];

const errorTestFields: PropertySchema[] = [
  {
    propertyType: PropertyType.URL,
    name: 'requiredDocuments',
    title: 'Обязательные поле с ссылками',
    openIn: 'popup',
    required: true,
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'errorDocuments',
    title: 'Пачка ссылок с ошибками',
    openIn: 'newTab',
    wellKnownRegex: 'url',
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'requiredDocuments2',
    title: 'Обязательные поле с ссылками',
    openIn: 'popup',
    required: true,
    multiple: true
  },
  {
    propertyType: PropertyType.URL,
    name: 'errorDocuments2',
    title: 'Пачка ссылок с ошибками',
    openIn: 'newTab',
    wellKnownRegex: 'url',
    multiple: true
  }
];

const emptyFields: PropertySchema[] = [
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
    { url: `${location.origin}/assets/test/html-fragment.html`, text: 'help' },
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
  errorsField.splice(0, errorsField.length, ...validateFormValue(value, errorTestFields));
});

const validateEmptyFields = action(() => {
  emptyField.splice(0, emptyField.length, ...validateFormValue(value, emptyFields));
});

const actionFunction = async (formValue: unknown) => {
  await sleep(2000 * Math.random());
  const errors = validateFormValue(formValue, testFields);

  if (errors.length) {
    throw { errors };
  }
};

const setFormValue = action((changedValue: Partial<TestData> = {}) => {
  Object.assign(value, emptyValue, changedValue);
});

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const EditableUrl = Template.bind({});
EditableUrl.args = {
  schema: { properties: testFields },
  value,
  errors,
  actionFunction,
  onFormChange: setFormValue
};

export const ReadonlyUrl = Template.bind({});
ReadonlyUrl.args = {
  readonly: true,
  schema: { properties: testFields },
  value,
  errors,
  onFormChange: setFormValue
};

const validateActions = (
  <FormStoryActions>
    <Button startIcon={<Biotech />} className={cnFormStoryActions('ValidateData')} onClick={validate}>
      Validate
    </Button>
  </FormStoryActions>
);

const validateEmptyFieldsActions = (
  <Button startIcon={<Biotech />} className={cnFormStoryActions('ValidateData')} onClick={validateEmptyFields}>
    Validate
  </Button>
);

export const ErrorsUrl = Template.bind({});
ErrorsUrl.args = {
  schema: { properties: errorTestFields },
  value,
  errors: errorsField,
  onFormChange: setFormValue,
  actions: validateActions
};

export const EmptyUrl = Template.bind({});
EmptyUrl.args = {
  schema: { properties: emptyFields },
  value,
  errors: emptyField,
  onFormChange: setFormValue,
  actions: validateEmptyFieldsActions
};

export const ReadOnlyEmptyUrl = Template.bind({});
ReadOnlyEmptyUrl.args = {
  readonly: true,
  schema: { properties: emptyFields },
  value,
  errors: emptyField,
  onFormChange: setFormValue
};
