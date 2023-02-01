import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/data/schema.models';

import { Form } from '../../Form';

export default {
  title: 'Form/Field/fias',
  component: Form
} as ComponentMeta<typeof Form>;

const value = {
  fias__address: 'Респ Крым, г.о. Алушта, г Алушта, ул Западная, д.12',
  fias__id: 53_865_363,
  fias__oktmo: '35703000001'
};

const testField: PropertySchema = {
  propertyType: PropertyType.FIAS,
  name: 'fias',
  title: 'Адрес'
};
const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const PlainControl = Template.bind({});
PlainControl.args = {
  schema: { properties: [testField] },
  value
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  schema: {
    properties: [
      {
        ...testField,
        defaultValue: {
          address: 'Респ Крым, г.о. Алушта, г Алушта, ул Западная, д.12',
          id: 53_865_363,
          oktmo: '35703000001'
        }
      }
    ]
  }
};
