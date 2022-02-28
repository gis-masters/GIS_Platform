import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/crg/schema.models';
import { FileInfo } from '../../../../services/files.service';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/file',
  component: Form
} as ComponentMeta<typeof Form>;

interface TestData extends Record<string, unknown> {
  certificate?: FileInfo[];
  photos?: FileInfo[];
}

const fieldsSingle: PropertySchema[] = [
  {
    propertyType: PropertyType.FILE,
    name: 'certificate',
    title: 'Сертификат',
    accept: 'application/pdf'
  }
];

const fieldsMultiple: PropertySchema[] = [
  {
    propertyType: PropertyType.FILE,
    name: 'photos',
    title: 'Фотки',
    accept: 'image/jpeg',
    multiple: true,
    maxFiles: 20
  }
];

const singleFileData: [FileInfo] = [{ id: 'someId', title: 'cert.pdf', size: 666 }];
const multipleFilesData: FileInfo[] = [
  { id: 'someId1', title: '.htaccess', size: 666 },
  { id: 'someId2', title: 'long.extension', size: 666 },
  { id: 'someId3', title: 'no_extension', size: 666 },
  { id: 'someId4', title: 'котик сидит.jpg', size: 666 },
  { id: 'someId5', title: 'кот охотится.JPG', size: 666 },
  {
    id: 'someId6',
    title:
      'котята кушают некую штуку с длинным-предлинным никуда не помещающимся названием с множеством разных слов.jpeg',
    size: 666
  }
];
const valueSingle: TestData = { certificate: singleFileData };
const valueMultiple: TestData = { photos: multipleFilesData };
const valueMultipleScroll: TestData = { photos: [...multipleFilesData, ...multipleFilesData] };

const Template: ComponentStory<typeof Form> = args => <Form {...args} />;

export const SingleEditable = Template.bind({}) as ComponentStory<typeof Form>;
SingleEditable.args = {
  fields: fieldsSingle,
  value: valueSingle,
  auto: true
};

export const SingleEditableEmpty = Template.bind({}) as ComponentStory<typeof Form>;
SingleEditableEmpty.args = {
  fields: fieldsSingle,
  value: {},
  auto: true
};

export const MultipleEditable = Template.bind({}) as ComponentStory<typeof Form>;
MultipleEditable.args = {
  fields: fieldsMultiple,
  value: valueMultiple,
  auto: true
};

export const MultipleEditableScroll = Template.bind({}) as ComponentStory<typeof Form>;
MultipleEditableScroll.args = {
  fields: fieldsMultiple,
  value: valueMultipleScroll,
  auto: true
};

export const MultipleEditableEmpty = Template.bind({}) as ComponentStory<typeof Form>;
MultipleEditableEmpty.args = {
  fields: fieldsMultiple,
  value: {},
  auto: true
};

export const SingleView = Template.bind({}) as ComponentStory<typeof Form>;
SingleView.args = {
  fields: fieldsSingle,
  value: valueSingle,
  readonly: true,
  auto: true
};

export const SingleViewEmpty = Template.bind({}) as ComponentStory<typeof Form>;
SingleViewEmpty.args = {
  fields: fieldsSingle,
  value: {},
  readonly: true,
  auto: true
};

export const MultipleView = Template.bind({}) as ComponentStory<typeof Form>;
MultipleView.args = {
  fields: fieldsMultiple,
  value: valueMultiple,
  readonly: true,
  auto: true
};

export const MultipleViewScroll = Template.bind({}) as ComponentStory<typeof Form>;
MultipleViewScroll.args = {
  fields: fieldsMultiple,
  value: valueMultipleScroll,
  readonly: true,
  auto: true
};

export const MultipleViewEmpty = Template.bind({}) as ComponentStory<typeof Form>;
MultipleViewEmpty.args = {
  fields: fieldsMultiple,
  value: { photos: [] },
  readonly: true,
  auto: true
};
