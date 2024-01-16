import React from 'react';
import { StoryFn } from '@storybook/react';

import { PropertySchemaString, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/string',
  component: Form
};

const emptyValue = {};

const stringField: PropertySchemaString[] = [
  {
    propertyType: PropertyType.STRING,
    name: 'zu',
    title: 'земельный участок',
    defaultValue: 'дефолтное значение'
  }
];

const value = { zu: 'короткое писание земельного участка' };
const longValue = {
  zu: 'очень длинное описание земельного участка которое содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси, и еще очень длинное описание земельного участка которое содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси'
};

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const LongValueEditable = Template.bind({});
LongValueEditable.args = {
  schema: { properties: stringField },
  value: longValue,
  auto: true
};

export const Editable = Template.bind({});
Editable.args = {
  schema: { properties: stringField },
  value,
  auto: true
};

export const EditableEmpty = Template.bind({});
EditableEmpty.args = {
  schema: { properties: stringField },
  value: emptyValue,
  auto: true
};

export const LongValueView = Template.bind({});
LongValueView.args = {
  schema: { properties: stringField },
  value: longValue,
  readonly: true,
  auto: true
};

export const View = Template.bind({});
View.args = {
  schema: { properties: stringField },
  value,
  readonly: true,
  auto: true
};

export const ViewEmpty = Template.bind({});
ViewEmpty.args = {
  schema: { properties: stringField },
  value: emptyValue,
  readonly: true,
  auto: true
};
