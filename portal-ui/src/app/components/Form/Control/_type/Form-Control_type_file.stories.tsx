import React from 'react';
import { StoryFn } from '@storybook/react';

import { FileInfo } from '../../../../services/data/files/files.models';
import { PropertySchema, PropertyType } from '../../../../services/data/schema/schema.models';
import { Form } from '../../Form';

export default {
  title: 'Form/Field/file',
  component: Form
};

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

const fileFieldsMultiple: PropertySchema[] = [
  {
    propertyType: PropertyType.FILE,
    name: 'files',
    multiple: true,
    title: 'dxf'
  }
];

const compoundFileFieldsMultiple: PropertySchema[] = [
  {
    propertyType: PropertyType.FILE,
    name: 'files',
    multiple: true,
    title: 'compound'
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
const multipleFilesData2: FileInfo[] = [
  { id: 'someId11', title: 'test.dxf', size: 666 },
  { id: 'someId11', title: 'test.gml', size: 666 }
];
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

const completedCompoundFilesData: FileInfo[] = [
  { id: 'someId1', title: 'shapeCompound.shp', size: 666 },
  { id: 'someId2', title: 'shapeCompound.shx', size: 666 },
  { id: 'someId3', title: 'shapeCompound.dbf', size: 666 },
  { id: 'someId4', title: 'shapeCompound.prj', size: 666 },
  { id: 'someId5', title: 'shapeCompound.sbn', size: 666 },
  { id: 'someId6', title: 'shapeCompound.sbx', size: 666 },
  { id: 'someId7', title: 'shapeCompound.fbn', size: 666 },
  { id: 'someId8', title: 'shapeCompound.fbx', size: 666 },
  { id: 'someId9', title: 'shapeCompound.ain', size: 666 },
  { id: 'someId10', title: 'shapeCompound.ixs', size: 666 },
  { id: 'someId11', title: 'shapeCompound.mxs', size: 666 },
  { id: 'someId12', title: 'shapeCompound.atx', size: 666 },
  { id: 'someId13', title: 'shapeCompound.xml', size: 666 }
];

const notCompletedCompoundFilesData: FileInfo[] = [
  { id: 'someId1', title: 'shapeCompound.shp', size: 666 },
  { id: 'someId2', title: 'shapeCompound.shx', size: 666 }
];
const valueSingle: TestData = { certificate: singleFileData };
const valueMultiple2: TestData = { files: multipleFilesData2 };
const valueMultiple: TestData = { photos: multipleFilesData };
const valueMultipleScroll: TestData = { photos: [...multipleFilesData, ...multipleFilesData] };
const completedCompoundValue: TestData = { files: completedCompoundFilesData };
const notCompletedCompoundFilesDataValue: TestData = { files: notCompletedCompoundFilesData };

const Template: StoryFn<typeof Form> = args => <Form {...args} />;

export const SingleEditable = Template.bind({});
SingleEditable.args = {
  schema: { properties: fieldsSingle },
  value: valueSingle,
  auto: true
};

export const SingleEditableEmpty = Template.bind({});
SingleEditableEmpty.args = {
  schema: { properties: fieldsSingle },
  value: {},
  auto: true
};

export const MultipleEditableWithFormRoleViewDocument = Template.bind({});
MultipleEditableWithFormRoleViewDocument.args = {
  schema: { properties: fileFieldsMultiple },
  value: valueMultiple2,
  formRole: 'viewDocument',
  auto: true
};

export const MultipleEditableWithoutFormRoles = Template.bind({});
MultipleEditableWithoutFormRoles.args = {
  schema: { properties: fileFieldsMultiple },
  value: valueMultiple2,
  auto: true
};

export const MultipleEditable = Template.bind({});
MultipleEditable.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultiple,
  auto: true
};

export const MultipleEditableScroll = Template.bind({});
MultipleEditableScroll.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultipleScroll,
  auto: true
};

export const MultipleEditableEmpty = Template.bind({});
MultipleEditableEmpty.args = {
  schema: { properties: fieldsMultiple },
  value: {},
  auto: true
};

export const SingleView = Template.bind({});
SingleView.args = {
  schema: { properties: fieldsSingle },
  value: valueSingle,
  readonly: true,
  auto: true
};

export const SingleViewEmpty = Template.bind({});
SingleViewEmpty.args = {
  schema: { properties: fieldsSingle },
  value: {},
  readonly: true,
  auto: true
};

export const MultipleView = Template.bind({});
MultipleView.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultiple,
  readonly: true,
  auto: true
};

export const MultipleViewScroll = Template.bind({});
MultipleViewScroll.args = {
  schema: { properties: fieldsMultiple },
  value: valueMultipleScroll,
  readonly: true,
  auto: true
};

export const MultipleViewEmpty = Template.bind({});
MultipleViewEmpty.args = {
  schema: { properties: fieldsMultiple },
  value: { photos: [] },
  readonly: true,
  auto: true
};

export const MultipleCompoundEditable = Template.bind({});
MultipleCompoundEditable.args = {
  schema: { properties: compoundFileFieldsMultiple },
  value: completedCompoundValue,
  auto: true
};

export const MultipleCompoundView = Template.bind({});
MultipleCompoundView.args = {
  schema: { properties: compoundFileFieldsMultiple },
  value: completedCompoundValue,
  formRole: 'viewDocument',
  readonly: true,
  auto: true
};

export const MultipleNotCompletedCompoundEditable = Template.bind({});
MultipleNotCompletedCompoundEditable.args = {
  schema: { properties: compoundFileFieldsMultiple },
  value: notCompletedCompoundFilesDataValue,
  auto: true
};

export const MultipleNotCompletedCompoundView = Template.bind({});
MultipleNotCompletedCompoundView.args = {
  schema: { properties: compoundFileFieldsMultiple },
  value: notCompletedCompoundFilesDataValue,
  formRole: 'viewDocument',
  readonly: true,
  auto: true
};
