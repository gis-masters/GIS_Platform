import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertySchema, PropertyType } from '../../../../services/crg/schema.models';
import { FileInfo } from '../../../../services/files.service';
import { Form } from '../../Form';
import { organizationSettings, Settings } from '../../../../stores/OrganizationSettings.store';

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

// заполнение стора настроек, удалить по возможности
const settings: Settings = {
  createProjectEnabled: true,
  dataManagementEnabled: true,
  editProjectLayersEnabled: true,
  createLibraryItemsEnabled: true,
  fileDownloadEnabled: true,
  downloadXmlGeometryEnabled: true
};

organizationSettings.setSettings(settings);

export const SingleEditable = Template.bind({});
SingleEditable.args = {
  fields: fieldsSingle,
  value: valueSingle,
  auto: true
};

export const SingleEditableEmpty = Template.bind({});
SingleEditableEmpty.args = {
  fields: fieldsSingle,
  value: {},
  auto: true
};

export const MultipleEditable = Template.bind({});
MultipleEditable.args = {
  fields: fieldsMultiple,
  value: valueMultiple,
  auto: true
};

export const MultipleEditableScroll = Template.bind({});
MultipleEditableScroll.args = {
  fields: fieldsMultiple,
  value: valueMultipleScroll,
  auto: true
};

export const MultipleEditableEmpty = Template.bind({});
MultipleEditableEmpty.args = {
  fields: fieldsMultiple,
  value: {},
  auto: true
};

export const SingleView = Template.bind({});
SingleView.args = {
  fields: fieldsSingle,
  value: valueSingle,
  readonly: true,
  auto: true
};

export const SingleViewEmpty = Template.bind({});
SingleViewEmpty.args = {
  fields: fieldsSingle,
  value: {},
  readonly: true,
  auto: true
};

export const MultipleView = Template.bind({});
MultipleView.args = {
  fields: fieldsMultiple,
  value: valueMultiple,
  readonly: true,
  auto: true
};

export const MultipleViewScroll = Template.bind({});
MultipleViewScroll.args = {
  fields: fieldsMultiple,
  value: valueMultipleScroll,
  readonly: true,
  auto: true
};

export const MultipleViewEmpty = Template.bind({});
MultipleViewEmpty.args = {
  fields: fieldsMultiple,
  value: { photos: [] },
  readonly: true,
  auto: true
};
