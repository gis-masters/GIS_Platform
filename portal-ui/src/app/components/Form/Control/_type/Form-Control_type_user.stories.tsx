/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { StoryFn } from '@storybook/react';

import { MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { PropertySchema, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/user',
  component: Form
};

const fieldsSingle: PropertySchema[] = [
  {
    propertyType: PropertyType.USER,
    name: 'boss',
    title: 'Начальник',
    multiple: false
  }
];

const fieldsMultiple: PropertySchema[] = [
  {
    propertyType: PropertyType.USER,
    name: 'bosses',
    title: 'Начальники',
    multiple: true
  }
];

const singleUserData: MinimizedCrgUser[] = [
  {
    surname: 'Сельское поселение',
    email: 'krasnopolyanskoe@mycrg.ru',
    name: 'Краснополянское',
    id: 374
  }
];

const multipleUsersData: MinimizedCrgUser[] = [
  {
    email: 'a.kolodina@mycrg.ru',
    surname: 'Колодина',
    name: 'Анна',
    id: 1277
  },
  {
    email: 'director@capitalfunnel.ru',
    surname: 'УМС',
    name: 'АИС',
    id: 1355
  },
  {
    email: 'ivanov@mail.com',
    surname: 'Иванов',
    name: 'Иван',
    id: 1180
  }
];
const valueSingle = { boss: JSON.stringify(singleUserData) };
const valueMultiple = { bosses: JSON.stringify(multipleUsersData) };
const valueMultipleScroll = {
  bosses: JSON.stringify([...multipleUsersData, ...multipleUsersData, ...multipleUsersData])
};

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const SingleEditable = Template.bind({});
SingleEditable.args = {
  schema: { properties: fieldsSingle },
  value: valueSingle,
  auto: true
};

export const SingleEditableEmpty = Template.bind({});
SingleEditableEmpty.args = {
  schema: { properties: fieldsSingle },
  value: {},
  auto: true
};

export const MultipleEditable = Template.bind({});
MultipleEditable.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultiple,
  auto: true
};

export const MultipleEditableEmpty = Template.bind({});
MultipleEditableEmpty.args = {
  schema: { properties: fieldsMultiple },
  value: {},
  auto: true
};

export const MultipleScrollEditable = Template.bind({});
MultipleScrollEditable.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultipleScroll,
  auto: true
};

export const SingleView = Template.bind({});
SingleView.args = {
  schema: { properties: fieldsSingle },
  value: valueSingle,
  readonly: true,
  auto: true
};

export const SingleViewEmpty = Template.bind({});
SingleViewEmpty.args = {
  schema: { properties: fieldsSingle },
  value: {},
  readonly: true,
  auto: true
};

export const MultipleView = Template.bind({});
MultipleView.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultiple,
  readonly: true,
  auto: true
};

export const MultipleScrollView = Template.bind({});
MultipleScrollView.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultipleScroll,
  readonly: true,
  auto: true
};

export const MultipleViewEmpty = Template.bind({});
MultipleViewEmpty.args = {
  schema: { properties: fieldsMultiple },
  value: {},
  readonly: true,
  auto: true
};
