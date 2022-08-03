import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveOutlined } from '@mui/icons-material';

import { PropertySchema, PropertyType } from '../../services/data/schema.models';

import { validateFormValue } from '../../services/formValidation.service';
import { sleep } from '../../services/util/sleep';
import { Toast } from '../Toast/Toast';

import { FormDialog } from './FormDialog';

export default {
  title: 'FormDialog',
  component: FormDialog
} as ComponentMeta<typeof FormDialog>;

interface TestData extends Record<string, unknown> {
  title: string;
  description?: string;
}

const testData: TestData = {
  title: 'Название',
  description: 'Описание писание писание писание'
};

const testFields: PropertySchema<TestData>[] = [
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

const actionFunction = async (formValue: TestData) => {
  await sleep(2000 * Math.random());
  const errors = validateFormValue(formValue, testFields as PropertySchema[]);

  if (errors.length) {
    throw { errors };
  }
};

const Template: ComponentStory<typeof FormDialog> = args => <FormDialog {...args} />;

export const Create = Template.bind({});
Create.args = {
  title: 'Сотворение штуки',
  open: true,
  schema: { properties: testFields as PropertySchema[] },
  actionButtonProps: { children: 'Создать штуку' },
  actionFunction,
  onSuccess: () => Toast.success('Создано успешно!'),
  onError: () => Toast.error('Error!')
};

export const Edit = Template.bind({});
Edit.args = {
  title: 'Редактирование штуки',
  open: true,
  schema: { properties: testFields as PropertySchema[] },
  value: testData,
  actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' },
  actionFunction,
  onSuccess: () => Toast.success('Сохранено!'),
  onError: () => Toast.error('Error!')
};
