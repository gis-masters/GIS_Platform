import React from 'react';
import { StoryFn } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/userId',
  component: Form
};

const properties: PropertySchema[] = [
  {
    propertyType: PropertyType.USER,
    name: 'boss',
    title: 'Начальник',
    multiple: false
  }
];

const value = { boss: 3 };

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const Editable = Template.bind({});
Editable.args = {
  schema: { properties },
  auto: true,
  value
};

export const EditableEmpty = Template.bind({});
EditableEmpty.args = {
  schema: { properties },
  auto: true,
  value: {}
};

export const View = Template.bind({});
View.args = {
  schema: { properties },
  auto: true,
  value,
  readonly: true
};

export const ViewEmpty = Template.bind({});
ViewEmpty.args = {
  schema: { properties },
  auto: true,
  value: {},
  readonly: true
};
