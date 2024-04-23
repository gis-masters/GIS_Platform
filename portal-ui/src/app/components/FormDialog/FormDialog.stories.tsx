import React from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { StoryFn } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { validateFormValue } from '../../services/util/form/formValidation.utils';
import { sleep } from '../../services/util/sleep';
import { Toast } from '../Toast/Toast';
import { FormDialog } from './FormDialog';

export default {
  title: 'FormDialog',
  component: FormDialog
};

interface TestData extends Record<string, unknown> {
  title: string;
  description?: string;
}

const testData: TestData = {
  title: 'Название',
  description: 'Описание писание писание писание'
};

const testFields: PropertySchema[] = [
  {
    propertyType: PropertyType.STRING,
    name: 'title',
    title: 'Название',
    required: true,
    minLength: 3
  },
  {
    propertyType: PropertyType.STRING,
    display: 'multiline',
    name: 'description',
    title: 'Описание'
  }
];

const actionFunction = async (formValue: unknown) => {
  await sleep(2000 * Math.random());
  const errors = validateFormValue(formValue, testFields);

  if (errors.length) {
    throw { errors };
  }
};

const Template: StoryFn<typeof FormDialog> = args => <FormDialog {...args} />;

export const Create = Template.bind({});
Create.args = {
  title: 'Сотворение штуки',
  open: true,
  schema: { properties: testFields },
  actionButtonProps: { children: 'Создать штуку' },
  actionFunction,
  onSuccess: () => Toast.success('Создано успешно!'),
  onError: () => Toast.error('Error!')
};

export const Edit = Template.bind({});
Edit.args = {
  title: 'Редактирование штуки',
  open: true,
  schema: { properties: testFields },
  value: testData,
  actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' },
  actionFunction,
  onSuccess: () => Toast.success('Сохранено!'),
  onError: () => Toast.error('Error!')
};
