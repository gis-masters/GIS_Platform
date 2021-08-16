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
  GEOMETRY = 'GEOMETRY',
  URL = 'URL',
  DATETIME = 'DATETIME',
  LOOKUP = 'LOOKUP',
  UUID = 'UUID',
  BINARY = 'BINARY',
  SET = 'SET', // пока что frontend only
  CHECKBOX = 'CHECKBOX', // пока что frontend only
  CUSTOM = 'CUSTOM' // frontend only
}

export interface FeatureDescription<T extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  title: string;
  description: string;
  properties: PropertySchema<T>[];
  tableName: string;
  geometryType: SupportedGeometryType;
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
  attributes: PropertySchema[];
}

export type PropertyEnumerations = { title: string; value: string | number }[];

interface BasePropertySchema<T extends Record<string, unknown> = Record<string, unknown>> {
  name: keyof T;
  title: string;
  valueType: ValueType;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  mustBeEmpty?: boolean;
  updateability?: Updateability;
  objectIdentityOnUi?: boolean;

  // хз
  choice?: unknown;
  allowedValues?: string[];
  resourcePath?: string;
}

export interface PropertySchemaStringText<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.STRING | ValueType.TEXT;
  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
}

interface PropertySchemaBaseNumber {
  totalDigits?: number;
  minInclusive?: number;
  maxInclusive?: number;
  measureUnit?: string;
}

export interface PropertySchemaInt<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T>,
    PropertySchemaBaseNumber {
  valueType: ValueType.INT;
}

export interface PropertySchemaDouble<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T>,
    PropertySchemaBaseNumber {
  valueType: ValueType.DOUBLE;
  fractionDigits?: number;
}

export interface PropertySchemaDatetime<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.DATETIME;
  dateFormat?: string;
}

export interface PropertySchemaChoice<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.CHOICE;
  isMultiple?: boolean;
  enumerations?: PropertyEnumerations;
  foreignKeyType?: string;
}

export interface PropertySchemaSet<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.SET;
  fieldsSet: PropertySchema[];
}

export interface PropertySchemaUrl<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.URL;
  displayMode?: 'in_popup';
}

export interface PropertySchemaCustom<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
}

export interface PropertySchemaOther<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  valueType: ValueType.LOOKUP | ValueType.GEOMETRY | ValueType.CHECKBOX | ValueType.BINARY | ValueType.UUID;
}

export type PropertySchema<T extends Record<string, unknown> = Record<string, unknown>> =
  | PropertySchemaStringText<T>
  | PropertySchemaInt<T>
  | PropertySchemaDouble<T>
  | PropertySchemaDatetime<T>
  | PropertySchemaSet<T>
  | PropertySchemaChoice<T>
  | PropertySchemaOther<T>
  | PropertySchemaUrl<T>
  | PropertySchemaCustom<T>;

export enum Updateability {
  CREATE_ONLY = 'CREATE_ONLY',
  CREATE_WRITE = 'CREATE_WRITE',
  READ_ONLY = 'READ_ONLY'
}

export interface EditedField {
  name: string;
  value: string;
  property: PropertySchema;
  isFgistpProperty: boolean;
}
