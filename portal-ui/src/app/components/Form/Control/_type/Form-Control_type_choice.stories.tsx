import React from 'react';
import { Button } from '@mui/material';
import { Send } from '@mui/icons-material';
import { StoryFn } from '@storybook/react';

import { PropertySchemaChoice, PropertyType } from '../../../../services/data/schema/schema.models';
import { sleep } from '../../../../services/util/sleep';
import { Toast } from '../../../Toast/Toast';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/choice',
  component: Form
};

const emptyValue = {};

const shortAddress = 'довольно короткий адрес';
const middleAddress = 'средний по размеру адрес который может занимать пару строк, а может и не пару';
const longAddress =
  'весьма длинный адрес который содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси, и еще весьма длинный адрес который содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси';

const choiceField: PropertySchemaChoice[] = [
  {
    propertyType: PropertyType.CHOICE,
    name: 'address',
    title: 'Адрес',
    defaultValue: 'address1',
    options: [
      { title: shortAddress, value: 'address1' },
      { title: middleAddress, value: 'address2' },
      {
        title: longAddress,
        value: 'address3'
      }
    ]
  }
];

const choiceFieldWithMultiple: PropertySchemaChoice[] = [
  {
    propertyType: PropertyType.CHOICE,
    name: 'address',
    title: 'Адрес',
    multiple: true,
    options: [
      { title: shortAddress, value: 'address1' },
      { title: middleAddress, value: 'address2' },
      {
        title: longAddress,
        value: 'address3'
      }
    ]
  }
];

const choiceFieldWithMultipleWithMatchNumber: PropertySchemaChoice[] = [
  {
    propertyType: PropertyType.CHOICE,
    name: 'address',
    title: 'Адрес',
    multiple: true,
    options: [
      { title: shortAddress, value: 'address1' },
      { title: middleAddress, value: 'address2' },
      { title: '#1', value: 1 },
      {
        title: longAddress,
        value: 'address3'
      }
    ]
  }
];

const multipleThreeValues = {
  address: JSON.stringify(['address1', 'address2', 'address3']),
  address2: ['address1', 'address2', 'address3']
};

const value = { address: 'address1' };
const longValue = { address: 'address3' };

const actionFunction = async (val: unknown) => {
  // имитируем обращение к серверу
  await sleep(Math.random() * 500);
  Toast.success(JSON.stringify(val, null, 2));
};

const actions = (
  <Button type='submit' startIcon={<Send />} color='primary'>
    Send
  </Button>
);

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const LongValueEditable = Template.bind({});
LongValueEditable.args = {
  schema: { properties: choiceField },
  value: longValue,
  auto: true
};

export const Editable = Template.bind({});
Editable.args = {
  schema: { properties: choiceField },
  value,
  auto: true
};

export const EditableEmpty = Template.bind({});
EditableEmpty.args = {
  schema: { properties: choiceField },
  value: emptyValue,
  auto: true
};

export const IncorrectValue = Template.bind({});
IncorrectValue.args = {
  schema: { properties: choiceFieldWithMultiple },
  value: { address: 'некорректное значение' },
  auto: true
};

export const LongValueView = Template.bind({});
LongValueView.args = {
  schema: { properties: choiceField },
  value: longValue,
  readonly: true,
  auto: true
};

export const View = Template.bind({});
View.args = {
  schema: { properties: choiceField },
  value,
  readonly: true,
  auto: true
};

export const ViewEmpty = Template.bind({});
ViewEmpty.args = {
  schema: { properties: choiceField },
  value: emptyValue,
  readonly: true,
  auto: true
};

export const MultipleEmpty = Template.bind({});
MultipleEmpty.args = {
  schema: {
    properties: [
      choiceFieldWithMultiple[0],
      { ...choiceFieldWithMultiple[0], name: 'address2' },
      { ...choiceFieldWithMultiple[0], name: 'address3' },
      { ...choiceFieldWithMultiple[0], name: 'address4' },
      { ...choiceFieldWithMultiple[0], name: 'address5' }
    ]
  },
  auto: true,
  value: { address: '[]', address2: null, address3: '', address5: [] },
  actions,
  actionFunction
};

export const MultipleThreeValues = Template.bind({});
MultipleThreeValues.args = {
  schema: { properties: [choiceFieldWithMultiple[0], { ...choiceFieldWithMultiple[0], name: 'address2' }] },
  auto: true,
  value: multipleThreeValues,
  actions,
  actionFunction
};

export const MultipleArrayNotIncludeValue = Template.bind({});
MultipleArrayNotIncludeValue.args = {
  schema: { properties: choiceFieldWithMultiple },
  auto: true,
  value: { address: ['address1', 'address2', 'notMatch', 'address3'] },
  actions,
  actionFunction
};

export const MultipleArrayIncludeValue = Template.bind({});
MultipleArrayIncludeValue.args = {
  schema: { properties: choiceFieldWithMultiple },
  auto: true,
  value: { address: ['address2', 'address3'] },
  actions,
  actionFunction
};

export const MultipleOneNumberValue = Template.bind({});
MultipleOneNumberValue.args = {
  schema: { properties: choiceFieldWithMultiple },
  auto: true,
  value: { address: 1 },
  actions,
  actionFunction
};

export const MultipleArrayWithNumbers = Template.bind({});
MultipleArrayWithNumbers.args = {
  schema: { properties: choiceFieldWithMultiple },
  auto: true,
  value: { address: [1, 2, 3] },
  actions,
  actionFunction
};

export const MultipleArrayWithNotMatchNumber = Template.bind({});
MultipleArrayWithNotMatchNumber.args = {
  schema: { properties: choiceFieldWithMultiple },
  auto: true,
  value: { address: ['address1', 1, 'address2', 'address3'] },
  actions,
  actionFunction
};

export const MultipleArrayWithMatchNumber = Template.bind({});
MultipleArrayWithMatchNumber.args = {
  schema: { properties: choiceFieldWithMultipleWithMatchNumber },
  auto: true,
  value: { address: ['address1', 1, 'address2', 'address3'] },
  actions,
  actionFunction
};
