import React, { useCallback, useState } from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { StoryFn } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { validateFormValue } from '../../services/util/form/formValidation.utils';
import { sleep } from '../../services/util/sleep';
import { schemaWithDefaultValue, schemaWithDynamicProperties } from '../Form/Form.stories';
import { getDefaultValues } from '../Form/Form.utils';
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

const saved = 'Сохранено!';

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

const Template: StoryFn<typeof FormDialog> = args => {
  const [open, setOpen] = useState<boolean>(true);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return <FormDialog {...args} onClose={onClose} open={open} />;
};

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
  onSuccess: () => Toast.success(saved),
  onError: () => Toast.error('Error!')
};

export const WithDinamicProps = Template.bind({});
WithDinamicProps.args = {
  title: 'С динамическими свойствами',
  schema: schemaWithDynamicProperties,
  closeWithConfirm: true,
  value: getDefaultValues(schemaWithDynamicProperties.properties),
  actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' },
  actionFunction,
  onSuccess: () => Toast.success(saved),
  onError: () => Toast.error('Error!')
};

export const WithDefaultValues = Template.bind({});
WithDefaultValues.args = {
  title: 'С дефолтными значениями',
  schema: schemaWithDefaultValue,
  closeWithConfirm: true,
  value: getDefaultValues(schemaWithDefaultValue.properties, { surname: 'Doe' }),
  actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' },
  actionFunction,
  onSuccess: () => Toast.success(saved),
  onError: () => Toast.error('Error!')
};
