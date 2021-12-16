import { ComponentType } from 'react';

import { SupportedGeometryType } from '../geoserver/wfs.models';
import { FormControlProps } from '../../components/Form/Control/Form-Control';

export enum PropertyType {
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
  FIAS = 'fias',
  CUSTOM = 'custom' // frontend only
}

export interface FeatureDescription<T extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  title: string;
  description?: string;
  properties?: PropertySchema<T>[];
  tableName?: string;
  geometryType?: SupportedGeometryType;
  matchingCounter?: number;
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

interface BasePropertySchema<T = Record<string, unknown>> {
  name: keyof T;
  propertyType: PropertyType;
  title: string;
  description?: string;
  category?: string;
  isSystemManaged?: string;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  asTitle?: boolean;
  isIndexed?: boolean;
  readOnly?: boolean;
  defaultValue?: unknown;
}

export interface PropertySchemaString<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.STRING;
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
  display?: 'number' | 'slider';
  maxValue?: number;
  minValue?: number;
  measureUnit?: string;
  allowMultipleValues?: boolean;
  step?: number;
}

export interface PropertySchemaInt<T = Record<string, unknown>>
  extends BasePropertySchema<T>,
    PropertySchemaBaseNumber {
  propertyType: PropertyType.INT;
  defaultValue?: number;
}

export interface PropertySchemaFloat<T = Record<string, unknown>>
  extends BasePropertySchema<T>,
    PropertySchemaBaseNumber {
  propertyType: PropertyType.FLOAT;
  precision?: number;
  defaultValue?: number;
}

export type PropertySchemaNumber = PropertySchemaInt | PropertySchemaFloat;

export interface PropertySchemaBool<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.BOOL;
  display?: 'checkbox' | 'switch';
  trueLabel?: string;
  falseLabel?: string;
  defaultValue?: boolean;
}

export interface PropertySchemaDatetime<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.DATETIME;
  display?: 'date' | 'datetime';
  format?: string;
  maxValue?: string;
  minValue?: string;
  defaultValue?: string;
}

export interface PropertySchemaTime<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.TIME;
  maxValue?: string;
  minValue?: string;
  defaultValue?: string;
}

export interface PropertySchemaDuration<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.DURATION;
  maxValue?: string;
  minValue?: string;
  defaultValue?: number;
}

export type PropertyOption = { title: string; value: string | number };

export interface PropertySchemaChoice<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.CHOICE;
  display?: 'select' | 'radiogroup';
  multiple?: boolean;
  allowMultipleValues?: boolean;
  allowFillIn?: boolean;
  defaultValue?: string | number;
  options: PropertyOption[];
}

export interface PropertySchemaUrl<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.URL;
  display?: 'popup' | 'newtab' | 'img';
  enablePreview?: boolean;
  regex?: string;
  defaultValue?: string;
}

export interface PropertySchemaCalculated<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.CALCULATED | PropertyType.URL | PropertyType.GEOMETRY | PropertyType.LOOKUP;
  wellKnownFormula?: string;
  formula?: string;
}

export interface PropertySchemaLookup<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.LOOKUP;
}

export interface PropertySchemaSet<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.SET;
  fieldsSet: PropertySchema[];
  defaultValue?: Record<string, unknown>;
}

export interface PropertySchemaCustom<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
  ViewComponent?: ComponentType<FormControlProps>;
  defaultValue?: unknown;
}

export interface PropertySchemaIdentities<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.IDENTITIES;
  allowMultipleValues?: boolean;
  tableName?: string;
  lookupFieldName?: string;
  additionalFields?: string;
}

export interface PropertySchemaFias<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.FIAS;
  searchMode?: 'address' | 'oktmo';
}

export interface PropertySchemaBinary<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.BINARY;
  accept?: string;
  maxSize?: number;
  isDefault?: string[];
  isEmbedded?: boolean;
}

export type PropertySchema<T = Record<string, unknown>> =
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
  | PropertySchemaFias<T>
  | PropertySchemaCustom<T>;
