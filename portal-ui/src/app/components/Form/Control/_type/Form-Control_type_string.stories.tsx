import React from 'react';
import { StoryFn } from '@storybook/react';

import { PropertySchemaString, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/string',
  component: Form
};

const emptyValue = {};

const stringField: PropertySchemaString = {
  propertyType: PropertyType.STRING,
  name: 'zu',
  title: 'земельный участок',
  defaultValue: 'дефолтное значение'
};
const value = { zu: 'короткое писание земельного участка' };
const codeValue = { zu: JSON.stringify(stringField, null, 2) };
const phoneValue = { zu: '+79781234567' };
const emailValue = { zu: 'email@ma.il' };
const longValue = {
  zu: 'очень длинное описание земельного участка которое содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси, и еще очень длинное описание земельного участка которое содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси'
};
const multilineValue = {
  zu: 'Тут есть несколько строк.\nОчень длинное описание земельного участка которое содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси, и еще очень длинное описание земельного участка которое содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси.'
};

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const LongValueEditable = Template.bind({});
LongValueEditable.args = {
  schema: { properties: [stringField] },
  value: longValue,
  auto: true
};

export const Editable = Template.bind({});
Editable.args = {
  schema: { properties: [stringField] },
  value,
  auto: true
};

export const EditableEmpty = Template.bind({});
EditableEmpty.args = {
  schema: { properties: [stringField] },
  value: emptyValue,
  auto: true
};

export const LongValueView = Template.bind({});
LongValueView.args = {
  schema: { properties: [stringField] },
  value: longValue,
  readonly: true,
  auto: true
};

export const View = Template.bind({});
View.args = {
  schema: { properties: [stringField] },
  value,
  readonly: true,
  auto: true
};

export const ViewEmpty = Template.bind({});
ViewEmpty.args = {
  schema: { properties: [stringField] },
  value: emptyValue,
  readonly: true,
  auto: true
};

export const CodeEditable = Template.bind({});
CodeEditable.args = {
  schema: { properties: [{ ...stringField, display: 'code' }] },
  value: codeValue,
  auto: true
};

export const CodeView = Template.bind({});
CodeView.args = {
  schema: { properties: [{ ...stringField, display: 'code' }] },
  value: codeValue,
  readonly: true,
  auto: true
};

export const PhoneEditable = Template.bind({});
PhoneEditable.args = {
  schema: { properties: [{ ...stringField, display: 'phone' }] },
  value: phoneValue,
  auto: true
};

export const PhoneView = Template.bind({});
PhoneView.args = {
  schema: { properties: [{ ...stringField, display: 'phone' }] },
  value: phoneValue,
  readonly: true,
  auto: true
};

export const EmailEditable = Template.bind({});
EmailEditable.args = {
  schema: { properties: [{ ...stringField, display: 'email' }] },
  value: emailValue,
  auto: true
};

export const EmailView = Template.bind({});
EmailView.args = {
  schema: { properties: [{ ...stringField, display: 'email' }] },
  value: emailValue,
  readonly: true,
  auto: true
};

export const MultilineEditable = Template.bind({});
MultilineEditable.args = {
  schema: { properties: [{ ...stringField, display: 'multiline' }] },
  value: multilineValue,
  auto: true
};

export const MultilineView = Template.bind({});
MultilineView.args = {
  schema: { properties: [{ ...stringField, display: 'multiline' }] },
  value: multilineValue,
  readonly: true,
  auto: true
};

export const Password = Template.bind({});
Password.args = {
  schema: { properties: [{ ...stringField, display: 'password' }] },
  value,
  auto: true
};
