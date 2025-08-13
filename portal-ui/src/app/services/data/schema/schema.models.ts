import { ComponentType, ReactNode } from 'react';
import { isObject } from 'lodash';

import { FormControlProps } from '../../../components/Form/Control/Form-Control';
import { SupportedGeometryType } from '../../geoserver/wfs/wfs.models';
import { FieldValidator } from '../../util/form/formValidation.utils';

export enum PropertyType {
  STRING = 'string',
  TEXT = 'text',
  INT = 'integer',
  LONG = 'long',
  FLOAT = 'float',
  BOOL = 'bool',
  DATETIME = 'dateTime',
  TIME = 'time',
  URL = 'url',
  CHOICE = 'choice',
  GEOMETRY = 'geometry',
  LOOKUP = 'lookup',
  UUID = 'uuid',
  BINARY = 'binary',
  FILE = 'file',
  SET = 'set',
  FIAS = 'fias',
  DOCUMENT = 'document',
  USER = 'user',
  USER_ID = 'userId',
  CUSTOM = 'custom' // frontend only
}

export function isPropertyType(value: unknown): value is PropertyType {
  return Object.values(PropertyType).includes(value as PropertyType);
}

export const schemaForSchema: SimpleSchema = {
  properties: [
    {
      propertyType: PropertyType.STRING,
      display: 'code',
      name: 'schema',
      validationFormula: (value: unknown): string[] | undefined => {
        try {
          JSON.parse(String(value));
        } catch {
          return ['Некорректное значение'];
        }
      },
      title: 'Схема'
    }
  ]
};

export type SimpleSchema = Partial<Schema> & Pick<Schema, 'properties'>;

export interface Schema {
  name: string;
  title: string;
  description?: string;
  properties: PropertySchema[];

  tableName?: string;
  styleName?: string;
  geometryType?: SupportedGeometryType;
  readOnly?: boolean;
  printTemplates?: string[];
  relations?: Relation[];
  definitionQuery?: string;

  appliedContentType?: string;
  appliedView?: string;
  contentTypes?: ContentType[];
  views?: ContentType[];

  childOnly?: boolean;
  children?: { library?: string; contentType: string }[];

  calcFiledFunction?: string;
  customRuleFunction?: string;
  tags?: string[];
}

export interface ContentType {
  id: string;
  type: string;
  title?: string;
  icon?: string;
  styleName?: string;
  properties: Partial<PropertySchema>[];
  childOnly?: boolean;
  readOnly?: boolean;
  children?: { library?: string; contentType: string }[];
  printTemplates?: string[];
  relations?: Relation[];
  definitionQuery?: string;
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

export type ValueFormula = (obj: unknown, property: PropertySchema, parent?: unknown) => unknown;
export type PropertyFormula = (obj: unknown, property: PropertySchema) => Partial<PropertySchema>;

export interface BasePropertySchema {
  name: string;
  propertyType: PropertyType;
  title: string;
  description?: ReactNode;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  asTitle?: boolean;
  readOnly?: boolean;
  minWidth?: number;
  defaultWidth?: number;
  defaultValue?: unknown;
  defaultValueFormula?: string | ValueFormula;
  defaultValueWellKnownFormula?: string;
  calculatedValueFormula?: string | ValueFormula;
  calculatedValueWellKnownFormula?: string;
  valueFormulaParams?: Record<string, unknown>;
  validationFormula?: FieldValidator;
  dynamicPropertyFormula?: string | PropertyFormula;
}

export interface PropertySchemaString extends BasePropertySchema {
  propertyType: PropertyType.STRING;
  display?: 'singleline' | 'multiline' | 'reachtext' | 'password' | 'phone' | 'code' | 'email';
  mask?: string;
  minLength?: number;
  maxLength?: number;
  maxDefaultWidth?: number;
  wellKnownRegex?: string;
  regex?: string;
  regexErrorMessage?: string;
  defaultValue?: string;
}

export interface PropertySchemaText extends BasePropertySchema {
  propertyType: PropertyType.TEXT;
  maxDefaultWidth?: number;
  defaultValue?: string;
}

interface PropertySchemaBaseNumber {
  display?: 'number' | 'slider';
  maxValue?: number;
  minValue?: number;
  measureUnit?: string;
  step?: number;
}

export interface PropertySchemaInt extends BasePropertySchema, PropertySchemaBaseNumber {
  propertyType: PropertyType.INT;
  defaultValue?: number;
}

export interface PropertySchemaLong extends BasePropertySchema, PropertySchemaBaseNumber {
  propertyType: PropertyType.LONG;
  defaultValue?: number;
}

export interface PropertySchemaFloat extends BasePropertySchema, PropertySchemaBaseNumber {
  propertyType: PropertyType.FLOAT;
  precision?: number;
  defaultValue?: number;
}

export type PropertySchemaNumber = PropertySchemaInt | PropertySchemaFloat | PropertySchemaLong;

export interface PropertySchemaBool extends BasePropertySchema {
  propertyType: PropertyType.BOOL;
  display?: 'checkbox' | 'switch';
  trueLabel?: string;
  falseLabel?: string;
  defaultValue?: boolean;
}

export interface PropertySchemaDatetime extends BasePropertySchema {
  propertyType: PropertyType.DATETIME;
  display?: 'date' | 'datetime';
  format?: string;
  maxValue?: string;
  minValue?: string;
  defaultValue?: string;
}

export type PropertyOption = {
  title: string;
  value: string | number;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export interface PropertySchemaChoice extends BasePropertySchema {
  propertyType: PropertyType.CHOICE;
  display?: 'select' | 'radiogroup' | 'buttongroup';
  multiple?: boolean;
  maxDefaultWidth?: number;
  defaultValue?: string | number;
  options: PropertyOption[];
}

export interface PropertySchemaUrl extends BasePropertySchema {
  propertyType: PropertyType.URL;
  openIn?: 'popup' | 'newTab';
  multiple?: boolean;
  enablePreview?: boolean;
  regex?: string;
  wellKnownRegex?: string;
  defaultValue?: string;
}

export interface PropertySchemaUser extends BasePropertySchema {
  propertyType: PropertyType.USER;
  multiple?: boolean;
  onlySubordinates?: boolean;
}

export interface PropertySchemaUserId extends BasePropertySchema {
  propertyType: PropertyType.USER_ID;
  onlySubordinates?: boolean;
}

export interface PropertySchemaLookup extends BasePropertySchema {
  propertyType: PropertyType.LOOKUP;
}

export interface PropertySchemaSet extends BasePropertySchema {
  propertyType: PropertyType.SET;
  properties: PropertySchema[];
  defaultValue?: Record<string, unknown>;
}

export interface PropertySchemaCustom extends BasePropertySchema {
  propertyType: PropertyType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
  ViewComponent?: ComponentType<FormControlProps>;
  defaultValue?: unknown;

  [key: string]: unknown;
}

export interface PropertySchemaFias extends BasePropertySchema {
  propertyType: PropertyType.FIAS;
  searchMode?: 'address' | 'oktmo';
}

export interface PropertySchemaBinary extends BasePropertySchema {
  propertyType: PropertyType.BINARY;
  accept?: string;
  maxSize?: number;
  isDefault?: string[];
  isEmbedded?: boolean;
}

export interface PropertySchemaFile extends BasePropertySchema {
  propertyType: PropertyType.FILE;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

export interface PropertySchemaDocument extends BasePropertySchema {
  propertyType: PropertyType.DOCUMENT;
  multiple?: boolean;
  library?: string;
  libraries?: string[];
  maxDocuments?: number;
}

export interface PropertySchemaGeometry extends BasePropertySchema {
  propertyType: PropertyType.GEOMETRY;
}

export interface PropertySchemaUuid extends BasePropertySchema {
  propertyType: PropertyType.UUID;
}

export type PropertySchema =
  | PropertySchemaString
  | PropertySchemaText
  | PropertySchemaInt
  | PropertySchemaLong
  | PropertySchemaFloat
  | PropertySchemaBool
  | PropertySchemaDatetime
  | PropertySchemaChoice
  | PropertySchemaUrl
  | PropertySchemaLookup
  | PropertySchemaSet
  | PropertySchemaBinary
  | PropertySchemaFias
  | PropertySchemaFile
  | PropertySchemaDocument
  | PropertySchemaUser
  | PropertySchemaUserId
  | PropertySchemaCustom
  | PropertySchemaGeometry
  | PropertySchemaUuid;

export type PropertiesAfterValidation = {
  validProperties: PropertySchema[];
  invalidProperties: unknown[];
};

export function isPropertySchema(obj: unknown): obj is PropertySchema {
  return (
    isObject(obj) &&
    'propertyType' in obj &&
    isPropertyType(obj.propertyType) &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string'
  );
}

export function isPropertySchemaArray(arr: unknown): arr is PropertySchema[] {
  return Array.isArray(arr) && arr.every(isPropertySchema);
}
