import { ComponentType, ReactNode } from 'react';

import { SupportedGeometryType } from '../geoserver/wfs.models';
import { FormControlProps } from '../../components/Form/Control/Form-Control';
import { FieldValidator } from '../formValidation.service';

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
  GEOMETRY = 'geometry',
  LOOKUP = 'lookup',
  UUID = 'uuid',
  BINARY = 'binary',
  FILE = 'file',
  IDENTITIES = 'identities',
  SET = 'set',
  FIAS = 'fias',
  DOCUMENT = 'document',
  CUSTOM = 'custom' // frontend only
}

export interface Schema<T = Record<string, unknown>> {
  name?: string;
  title?: string;
  description?: string;
  properties?: PropertySchema<T>[];
  tableName?: string;
  styleName?: string;
  geometryType?: SupportedGeometryType;
  readOnly?: boolean;
  contentTypes?: ContentType[];
  childOnly?: boolean;
  children?: { library?: string; contentType: string }[];
  printTemplates?: string[];
  relations?: Relation[];
}

export interface ContentType {
  id: string;
  type: string;
  title?: string;
  icon?: string;
  styleName?: string;
  properties: Partial<PropertySchema>[];
  childOnly?: boolean;
  children?: { library?: string; contentType: string }[];
  printTemplates?: string[];
  relations?: Relation[];
}

export interface Relation {
  title: string;
  type: 'document' | 'feature';
  property: string;
  targetProperty?: string;
  library?: string;
  projectId?: number;
  layers?: string[];
}

export type ValueFormula = (
  obj: Record<string, unknown>,
  property: PropertySchema,
  parent?: Record<string, unknown>
) => unknown;

interface BasePropertySchema<T = Record<string, unknown>> {
  name: keyof T & string;
  propertyType: PropertyType;
  title: string;
  description?: ReactNode;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  asTitle?: boolean;
  readOnly?: boolean;
  minWidth?: number;
  defaultValue?: unknown;
  defaultValueFormula?: string | ValueFormula;
  defaultValueWellKnownFormula?: string;
  calculatedValueFormula?: string | ValueFormula;
  calculatedValueWellKnownFormula?: string;
  valueFormulaParams?: Record<string, unknown>;
  customValidationFunction?: FieldValidator;
}

export interface PropertySchemaString<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.STRING;
  display?: 'singleline' | 'multiline' | 'reachtext' | 'password' | 'phone' | 'code' | 'email';
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

export type PropertyOption = { title: string; value: string | number };

export interface PropertySchemaChoice<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.CHOICE;
  display?: 'select' | 'radiogroup' | 'buttongroup';
  multiple?: boolean;
  allowMultipleValues?: boolean;
  allowFillIn?: boolean;
  defaultValue?: string | number;
  options: PropertyOption[];
}

export interface PropertySchemaUrl<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.URL;
  openIn?: 'popup' | 'newTab';
  multiple?: boolean;
  enablePreview?: boolean;
  regex?: string;
  wellKnownRegex?: string;
  defaultValue?: string;
}

export interface PropertySchemaLookup<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.LOOKUP;
}

export interface PropertySchemaSet<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.SET;
  properties: PropertySchema[];
  defaultValue?: Record<string, unknown>;
}

export interface PropertySchemaCustom<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
  ViewComponent?: ComponentType<FormControlProps>;
  defaultValue?: unknown;
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

export interface PropertySchemaFile<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.FILE;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

export interface PropertySchemaDocument<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.DOCUMENT;
  multiple?: boolean;
  library?: string;
  libraries?: string[];
  maxDocuments?: number;
}

export interface PropertySchemaGeometry<T = Record<string, unknown>> extends BasePropertySchema<T> {
  propertyType: PropertyType.GEOMETRY;
}

export type PropertySchema<T = Record<string, unknown>> =
  | PropertySchemaString<T>
  | PropertySchemaInt<T>
  | PropertySchemaFloat<T>
  | PropertySchemaBool<T>
  | PropertySchemaDatetime<T>
  | PropertySchemaChoice<T>
  | PropertySchemaUrl<T>
  | PropertySchemaLookup<T>
  | PropertySchemaSet<T>
  | PropertySchemaBinary<T>
  | PropertySchemaFias<T>
  | PropertySchemaFile<T>
  | PropertySchemaDocument<T>
  | PropertySchemaCustom<T>
  | PropertySchemaGeometry<T>;
