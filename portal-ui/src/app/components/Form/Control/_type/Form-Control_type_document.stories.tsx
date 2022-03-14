import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/crg/schema.models';
import { DocumentInfo } from '../../../Documents/Documents';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/document',
  component: Form
} as ComponentMeta<typeof Form>;

interface TestData extends Record<string, unknown> {
  permissive_document?: string;
  reglaments?: string;
}

const fieldsSingle: PropertySchema[] = [
  {
    propertyType: PropertyType.DOCUMENT,
    name: 'permissive_document',
    title: 'Разрешение'
  }
];

const fieldsMultiple: PropertySchema[] = [
  {
    propertyType: PropertyType.DOCUMENT,
    name: 'reglaments',
    title: 'Регламенты',
    library: 'dl_default',
    multiple: true,
    maxDocuments: 6
  }
];

const singleFileData: [DocumentInfo] = [
  { id: 290, libraryId: 'dl_data_section3', title: 'Разрешение на строительство №333 от 32.05.2000' }
];
const multipleFilesData: DocumentInfo[] = [
  { id: 288, libraryId: 'dl_data_section3', title: 'Ж1' },
  { id: 290, libraryId: 'dl_data_section3', title: 'Ж2' },
  { id: 257, libraryId: 'dl_data_section3', title: 'Ж3' },
  {
    id: 317,
    libraryId: 'dl_data_section333',
    title:
      'Документ с длинным-предлинным никуда не помещающимся названием с множеством разных никому не интересных и всё же абсолютно обязательных к написанию слов'
  }
];
const valueSingle: TestData = { permissive_document: JSON.stringify(singleFileData) };
const valueMultiple: TestData = { reglaments: JSON.stringify(multipleFilesData) };
const valueMultipleScroll: TestData = { reglaments: JSON.stringify([...multipleFilesData, ...multipleFilesData]) };

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
