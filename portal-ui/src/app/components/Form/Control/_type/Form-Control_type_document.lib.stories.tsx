import React from 'react';
import { StoryFn } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/document/lib',
  component: Form
};

const field: PropertySchema = {
  propertyType: PropertyType.DOCUMENT,
  name: 'reglaments',
  title: 'Регламенты'
};

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const AnyLibrary = Template.bind({});
AnyLibrary.args = {
  schema: { properties: [field] },
  value: {},
  auto: true
};

export const LegacyLibrary = Template.bind({});
LegacyLibrary.args = {
  schema: { properties: [{ ...field, library: 'dl_data_section3' }] },
  value: {},
  auto: true
};

export const SingleLibrary = Template.bind({});
SingleLibrary.args = {
  schema: { properties: [{ ...field, libraries: ['dl_data_section3'] }] },
  value: {},
  auto: true
};

export const MultipleLibrary = Template.bind({});
MultipleLibrary.args = {
  schema: { properties: [{ ...field, libraries: ['dl_data_section3', 'dl_data_section5'] }] },
  value: {},
  auto: true
};

export const WithNotExisting = Template.bind({});
WithNotExisting.args = {
  schema: { properties: [{ ...field, libraries: ['dl_data_section3', 'not exist'] }] },
  value: {},
  auto: true
};

export const OnlyNotExisting = Template.bind({});
OnlyNotExisting.args = {
  schema: { properties: [{ ...field, libraries: ['not exist', 'not exist too'] }] },
  value: {},
  auto: true
};
