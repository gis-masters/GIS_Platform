import React from 'react';
import { action, observable } from 'mobx';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/data/schema.models';

import { Form } from '../../Form';

export default {
  title: 'Form/Field/fias',
  component: Form
} as ComponentMeta<typeof Form>;

interface TestData extends Record<string, unknown> {
  fullAddress: string;
  objectId: number;
  oktmo: string;
}

const emptyValue: Partial<TestData> = {};

const testFields: PropertySchema<TestData>[] = [
  {
    propertyType: PropertyType.FIAS,
    name: 'fullAddress',
    title: 'Адрес'
  }
];

const value = observable({
  fullAddress__address: 'Респ Крым, г.о. Алушта, г Алушта, ул Западная, д.12',
  fullAddress__id: 53_865_363,
  fullAddress__oktmo: '35703000001'
} as Record<string, unknown>);

const setFormValue = action((changedValue: Partial<TestData> = {}) => {
  Object.assign(value, emptyValue, changedValue);
});

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const PlainControl = Template.bind({});
PlainControl.args = {
  schema: { properties: testFields as PropertySchema[] },
  value,
  onFormChange: setFormValue
};
