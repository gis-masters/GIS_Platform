import React from 'react';
import { Send } from '@mui/icons-material';
import { StoryFn } from '@storybook/react';

import { FiasValue } from '../../../../services/data/fias/fias.models';
import { PropertySchema, PropertyType, SimpleSchema } from '../../../../services/data/schema/schema.models';
import { sleep } from '../../../../services/util/sleep';
import { Button } from '../../../Button/Button';
import { Toast } from '../../../Toast/Toast';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/fias',
  component: Form
};

const addressValue = {
  fias__address: 'Респ Крым, г.о. Алушта, г Алушта, ул Западная, д.12',
  fias__id: 53_865_363,
  fias__oktmo: '35703000001'
};
const fieldAddressValue: FiasValue = {
  address: addressValue.fias__address,
  id: addressValue.fias__id,
  oktmo: addressValue.fias__oktmo
};
const oktmoValue = {
  fias__address: 'вн.тер.г. Балаклавский муниципальный округ, п 1-е отделение Золотой Балки',
  fias__id: 1_453_621,
  fias__oktmo: '67302000136'
};
const fieldOktmoValue: FiasValue = {
  address: oktmoValue.fias__address,
  id: oktmoValue.fias__id,
  oktmo: oktmoValue.fias__oktmo
};

const testField: PropertySchema = {
  propertyType: PropertyType.FIAS,
  name: 'fias',
  title: 'Адрес'
};
const schema: SimpleSchema = { properties: [testField] };
const schemaWithDefaultValue: SimpleSchema = { properties: [{ ...testField, defaultValue: fieldAddressValue }] };
const schemaOktmo: SimpleSchema = { properties: [{ ...testField, searchMode: 'oktmo' }] };
const schemaOktmoWithDefaultValue: SimpleSchema = {
  properties: [{ ...testField, searchMode: 'oktmo', defaultValue: fieldOktmoValue }]
};

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

const actionFunction = async (val: unknown) => {
  await sleep(Math.random() * 500);
  Toast.success(JSON.stringify(val, null, 2));
};

const actions = (
  <Button type='submit' startIcon={<Send />} color='primary'>
    Send
  </Button>
);

export const FilledAddress = Template.bind({});
FilledAddress.args = {
  auto: true,
  schema,
  value: addressValue,
  actions,
  actionFunction
};

export const DefaultValueAddress = Template.bind({});
DefaultValueAddress.args = {
  auto: true,
  schema: schemaWithDefaultValue,
  actions,
  actionFunction
};

export const FilledOktmo = Template.bind({});
FilledOktmo.args = {
  auto: true,
  schema: schemaOktmo,
  value: oktmoValue,
  actions,
  actionFunction
};

export const DefaultValueOktmo = Template.bind({});
DefaultValueOktmo.args = {
  auto: true,
  schema: schemaOktmoWithDefaultValue,
  actions,
  actionFunction
};

export const Empty = Template.bind({});
Empty.args = {
  auto: true,
  schema,
  actions,
  actionFunction
};
