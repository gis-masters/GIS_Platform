import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertySchemaChoice, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/choice',
  component: Form
} as ComponentMeta<typeof Form>;

const emptyValue = {};

const choiceField: PropertySchemaChoice[] = [
  {
    propertyType: PropertyType.CHOICE,
    name: 'address',
    title: 'Адрес',
    defaultValue: 'address1',
    options: [
      { title: 'довольно короткий адрес', value: 'address1' },
      { title: 'средний по размеру адрес который может занимать пару строк, а может и не пару', value: 'address2' },
      {
        title:
          'весьма длинный адрес который содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси, и еще весьма длинный адрес который содержит чрезмерное количество ненужной информации, которая тем не менее может быть нужной только лишь для того, что бы использовать её в различных тестах и прочей возможно нужной ереси',
        value: 'address3'
      }
    ]
  }
];

const value = { address: 'address1' };
const longValue = { address: 'address3' };

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

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
