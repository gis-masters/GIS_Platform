import { ComponentType } from 'react';

import { SupportedGeometryType } from '../geoserver/wfs.models';
import { FormControlProps } from '../../components/Form/Control/Form-Control';

export enum FieldType {
  STRING = 'string',
  INT = 'integer',
  FLOAT = 'float',
  BOOL = 'bool',
  DATETIME = 'dateTime',
  TIME = 'time',
  DURATION = 'duration',
  URL = 'url',
  CALCULATED = 'calculated',
  CHOICE = 'choice',
  GEOMETRY = 'Geometry',
  LOOKUP = 'lookup',
  UUID = 'uuid',
  BINARY = 'binary',
  IDENTITIES = 'identities',
  SET = 'set',
  CUSTOM = 'custom' // frontend only
}

export interface FeatureDescription<T extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  title: string;
  description?: string;
  properties?: PropertySchema<T>[];
  tableName?: string;
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
  attributes: PropertySchema[];
}

interface BasePropertySchema<T extends Record<string, unknown> = Record<string, unknown>> {
  name: keyof T;
  fieldType: FieldType;
  title: string;
  description?: string;
  category?: string;
  isSystemManaged?: string;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  asTitle?: boolean;
  isIndexed?: boolean;
  defaultValue?: unknown;
}

export interface PropertySchemaString<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.STRING;
  display?: 'singleline' | 'multiline' | 'reachtext';
  mask?: string;
  minLength?: number;
  maxLength?: number;
  wellKnownRegex?: string;
  regex?: string;
  regexErrorMessage?: string;
  defaultValue?: string;
}

interface PropertySchemaBaseNumber {
  display?: 'text' | 'number' | 'slider';
  maxValue?: number;
  minValue?: number;
  measureUnit?: string;
  allowMultipleValues?: boolean;
  step?: number;
}

export interface PropertySchemaInt<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T>,
    PropertySchemaBaseNumber {
  fieldType: FieldType.INT;
  defaultValue?: number;
}

export interface PropertySchemaFloat<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T>,
    PropertySchemaBaseNumber {
  fieldType: FieldType.FLOAT;
  precision?: number;
  defaultValue?: number;
}

export interface PropertySchemaBool<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.BOOL;
  display?: 'checkbox' | 'switch';
  trueLabel?: string;
  falseLabel?: string;
  defaultValue?: boolean;
}

export interface PropertySchemaDatetime<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.DATETIME;
  display?: 'date' | 'datetime';
  format?: string;
  maxValue?: string;
  minValue?: string;
  defaultValue?: string;
}

export interface PropertySchemaTime<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.TIME;
  maxValue?: string;
  minValue?: string;
  defaultValue?: string;
}

export interface PropertySchemaDuration<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.DURATION;
  maxValue?: string;
  minValue?: string;
  defaultValue?: number;
}

export type PropertyOption = { title: string; value: string | number };

export interface PropertySchemaChoice<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.CHOICE;
  display?: 'select' | 'radiogroup';
  multiple?: boolean;
  allowMultipleValues?: boolean;
  allowFillIn?: boolean;
  defaultValue?: string | number;
  options: PropertyOption[];
}

export interface PropertySchemaUrl<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.URL;
  display?: 'popup' | 'newtab' | 'img';
  enablePreview?: boolean;
  regex?: string;
  defaultValue?: string;
}

export interface PropertySchemaCalculated<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.CALCULATED | FieldType.URL | FieldType.GEOMETRY | FieldType.LOOKUP;
  wellKnownFormula?: string;
  formula?: string;
}

export interface PropertySchemaLookup<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.LOOKUP;
}

export interface PropertySchemaSet<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.SET;
  fieldsSet: PropertySchema[];
  defaultValue?: Record<string, unknown>;
}

export interface PropertySchemaCustom<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
  defaultValue?: unknown;
}

export interface PropertySchemaIdentities<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.IDENTITIES;
  allowMultipleValues?: boolean;
  tableName?: string;
  lookupFieldName?: string;
  additionalFields?: string;
}

export interface PropertySchemaBinary<T extends Record<string, unknown> = Record<string, unknown>>
  extends BasePropertySchema<T> {
  fieldType: FieldType.BINARY;
  accept?: string;
  maxSize?: number;
  isDefault?: string[];
  isEmbedded?: boolean;
}

export type PropertySchema<T extends Record<string, unknown> = Record<string, unknown>> =
  | PropertySchemaString<T>
  | PropertySchemaInt<T>
  | PropertySchemaFloat<T>
  | PropertySchemaBool<T>
  | PropertySchemaDatetime<T>
  | PropertySchemaTime<T>
  | PropertySchemaDuration<T>
  | PropertySchemaChoice<T>
  | PropertySchemaUrl<T>
  | PropertySchemaCalculated<T>
  | PropertySchemaLookup<T>
  | PropertySchemaSet<T>
  | PropertySchemaBinary<T>
  | PropertySchemaCustom<T>;
