import { ComponentType, ReactNode } from 'react';

import { SupportedGeometryType } from '../../geoserver/wfs/wfs.models';
import { FormControlProps } from '../../../components/Form/Control/Form-Control';
import { FieldValidator } from '../../formValidation.service';

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
  USER = 'user',
  USER_ID = 'userId',
  CUSTOM = 'custom' // frontend only
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
  validationFormula?: FieldValidator;
}

export interface PropertySchemaString extends BasePropertySchema {
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

export interface PropertySchemaInt extends BasePropertySchema, PropertySchemaBaseNumber {
  propertyType: PropertyType.INT;
  defaultValue?: number;
}

export interface PropertySchemaFloat extends BasePropertySchema, PropertySchemaBaseNumber {
  propertyType: PropertyType.FLOAT;
  precision?: number;
  defaultValue?: number;
}

export type PropertySchemaNumber = PropertySchemaInt | PropertySchemaFloat;

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

export type PropertyOption = { title: string; value: string | number; startIcon?: ReactNode; endIcon?: ReactNode };

export interface PropertySchemaChoice extends BasePropertySchema {
  propertyType: PropertyType.CHOICE;
  display?: 'select' | 'radiogroup' | 'buttongroup';
  multiple?: boolean;
  allowMultipleValues?: boolean;
  allowFillIn?: boolean;
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
}

export interface PropertySchemaUserId extends BasePropertySchema {
  propertyType: PropertyType.USER_ID;
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

export type PropertySchema =
  | PropertySchemaString
  | PropertySchemaInt
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
  | PropertySchemaGeometry;
