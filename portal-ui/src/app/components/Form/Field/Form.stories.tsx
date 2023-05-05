import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertyType, SimpleSchema } from '../../../services/data/schema/schema.models';

import { Form } from '../Form';

export default {
  title: 'Form/Field/_withRelations',
  component: Form
} as ComponentMeta<typeof Form>;

interface TestData extends Record<string, unknown> {
  name: string;
}

const schema: SimpleSchema = {
  relations: [
    {
      title: 'Документы на это имя',
      property: 'name',
      library: 'someLibrary',
      type: 'document'
    }
  ],
  properties: [
    {
      propertyType: PropertyType.STRING,
      name: 'name',
      title: 'Имя'
    }
  ]
};

const value: TestData = {
  name: 'Терентий'
};

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const Editable = Template.bind({});
Editable.args = {
  schema,
  value
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  schema,
  value,
  readonly: true
};
