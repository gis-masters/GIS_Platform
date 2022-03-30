import { ComponentType } from 'react';

import { SupportedGeometryType } from '../geoserver/wfs.models';
import { FormControlProps } from '../../components/Form/Control/Form-Control';

// Править в соответствии с
// contracts/data-service-contract/src/main/java/ru/mycrg/data_service_contract/enums/ValueType.java
export enum ValueType {
  INT = 'INT',
  STRING = 'STRING',
  TEXT = 'TEXT',
  DOUBLE = 'DOUBLE',
  CHOICE = 'CHOICE',
  BOOLEAN = 'BOOLEAN',
  GEOMETRY = 'GEOMETRY',
  URL = 'URL',
  DATETIME = 'DATETIME',
  LOOKUP = 'LOOKUP',
  UUID = 'UUID',
  BINARY = 'BINARY',
  FIAS = 'FIAS',
  FILE = 'FILE',
  DOCUMENT = 'DOCUMENT',
  SET = 'SET', // пока что frontend only
  CHECKBOX = 'CHECKBOX', // пока что frontend only
  CUSTOM = 'CUSTOM' // frontend only
}

export interface OldFeatureDescription<T extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  title: string;
  description?: string;
  properties: OldPropertySchema<T>[];
  tableName: string;
  originName?: string;
  geometryType?: SupportedGeometryType;
  customRuleFunction?: string;
  matchingCounter?: number;
  calcFiledFunction?: string;
  readOnly?: boolean;
  contentTypes?: ContentType[];
}

export interface ContentType {
  id: string;
  type: string;
  title?: string;
  icon?: string;
  attributes: OldPropertySchema[];
}

export type PropertyEnumeration = { title: string; value: string | number };

interface OldBasePropertySchema<T extends Record<string, unknown> = Record<string, unknown>> {
  name: keyof T;
  title: string;
  valueType: ValueType;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  mustBeEmpty?: boolean;
  updateability?: Updateability;
  objectIdentityOnUi?: boolean;
  sequenceNumber?: number;
  minWidth?: number;
  readOnly?: boolean;

  // хз
  choice?: unknown;
  allowedValues?: string[];
  resourcePath?: string;
  folderId?: string;
}

export interface OldPropertySchemaStringText<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.STRING | ValueType.TEXT;
  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
}

interface OldPropertySchemaBaseNumber {
  totalDigits?: number;
  minInclusive?: number;
  maxInclusive?: number;
  measureUnit?: string;
}

export interface OldPropertySchemaInt<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T>,
    OldPropertySchemaBaseNumber {
  valueType: ValueType.INT;
}

export interface OldPropertySchemaDouble<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T>,
    OldPropertySchemaBaseNumber {
  valueType: ValueType.DOUBLE;
  fractionDigits?: number;
}

export interface OldPropertySchemaDatetime<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.DATETIME;
  dateFormat?: string;
}

export interface OldPropertySchemaChoice<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.CHOICE;
  isMultiple?: boolean;
  enumerations?: PropertyEnumeration[];
  foreignKeyType?: string;
}

export interface OldPropertySchemaBoolean<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.BOOLEAN;
}

export interface OldPropertySchemaSet<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.SET;
  fieldsSet: OldPropertySchema[];
}

export interface OldPropertySchemaUrl<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.URL;
  displayMode?: 'in_popup';
}

export interface OldPropertyFiasSchema<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.FIAS;
  searchMode?: 'address' | 'oktmo';
}

export interface OldPropertyFileSchema<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.FILE;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
}

export interface OldPropertyDocumentSchema<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.DOCUMENT;
  multiple?: boolean;
}

export interface OldPropertySchemaCustom<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
}

export interface OldPropertySchemaOther<T extends Record<string, unknown> = Record<string, unknown>>
  extends OldBasePropertySchema<T> {
  valueType: ValueType.LOOKUP | ValueType.GEOMETRY | ValueType.CHECKBOX | ValueType.BINARY | ValueType.UUID;
}

export type OldPropertySchema<T extends Record<string, unknown> = Record<string, unknown>> =
  | OldPropertySchemaStringText<T>
  | OldPropertySchemaInt<T>
  | OldPropertySchemaDouble<T>
  | OldPropertySchemaDatetime<T>
  | OldPropertySchemaBoolean<T>
  | OldPropertySchemaSet<T>
  | OldPropertySchemaChoice<T>
  | OldPropertySchemaOther<T>
  | OldPropertySchemaUrl<T>
  | OldPropertySchemaCustom<T>
  | OldPropertyFiasSchema<T>
  | OldPropertyFileSchema<T>
  | OldPropertyDocumentSchema<T>;

export enum Updateability {
  CREATE_ONLY = 'CREATE_ONLY',
  CREATE_WRITE = 'CREATE_WRITE',
  READ_ONLY = 'READ_ONLY'
}

export interface EditedField {
  name: string;
  value: string;
  property: OldPropertySchema;
  isFgistpProperty: boolean;
}
