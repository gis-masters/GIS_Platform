import { ComponentType, ReactNode } from 'react';

import { FormControlProps } from '../../../components/Form/Control/Form-Control';
import { SupportedGeometryType } from '../../geoserver/wfs/wfs.models';
import { Relation } from './schema.models';

// Править в соответствии с
// contracts/data-service-contract/src/main/java/ru/mycrg/data_service_contract/enums/ValueType.java
export enum ValueType {
  INT = 'INT',
  LONG = 'LONG',
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
  USER = 'USER',
  USER_ID = 'USER_ID',
  SET = 'SET', // пока что frontend only
  CHECKBOX = 'CHECKBOX', // пока что frontend only
  CUSTOM = 'CUSTOM' // frontend only
}

export interface OldSchema {
  name: string;
  title: string;
  description?: string;
  properties: OldPropertySchema[];
  tableName?: string;
  styleName?: string;
  originName?: string;
  geometryType?: SupportedGeometryType;
  matchingCounter?: number;
  readOnly?: boolean;
  childOnly?: boolean;
  children?: { library?: string; contentType: string }[];
  contentTypes?: OldContentType[];
  views?: OldContentType[];
  printTemplates?: string[];
  relations?: Relation[];
  calcFiledFunction?: string;
  customRuleFunction?: string;
  definitionQuery?: string;
}

export interface OldContentType {
  id: string;
  type: string;
  title?: string;
  icon?: string;
  styleName?: string;
  childOnly?: boolean;
  children?: { library?: string; contentType: string }[];
  printTemplates?: string[];
  relations?: Relation[];
  attributes: Partial<OldPropertySchema>[];
  definitionQuery?: string;
}

export type PropertyEnumeration = { title: string; value: string | number; startIcon?: ReactNode; endIcon?: ReactNode };

interface OldBasePropertySchema {
  name: string;
  title: string;
  valueType: ValueType;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  mustBeEmpty?: boolean;
  updateability?: Updateability;
  objectIdentityOnUi?: boolean;
  minWidth?: number;
  readOnly?: boolean;
  defaultValue?: unknown;

  // хз
  choice?: unknown;
  allowedValues?: string[];
  resourcePath?: string;
  folderId?: string;
}

export interface OldPropertySchemaString extends OldBasePropertySchema {
  valueType: ValueType.STRING;
  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
  defaultValue?: string;
}

export interface OldPropertySchemaText extends OldBasePropertySchema {
  valueType: ValueType.TEXT;
  defaultValue?: string;
}

interface OldPropertySchemaBaseNumber {
  totalDigits?: number;
  minInclusive?: number;
  maxInclusive?: number;
  measureUnit?: string;
}

export interface OldPropertySchemaInt extends OldBasePropertySchema, OldPropertySchemaBaseNumber {
  valueType: ValueType.INT;
  defaultValue?: number;
}

export interface OldPropertySchemaLong extends OldBasePropertySchema, OldPropertySchemaBaseNumber {
  valueType: ValueType.LONG;
  defaultValue?: number;
}

export interface OldPropertySchemaDouble extends OldBasePropertySchema, OldPropertySchemaBaseNumber {
  valueType: ValueType.DOUBLE;
  fractionDigits?: number;
  defaultValue?: number;
}

export interface OldPropertySchemaDatetime extends OldBasePropertySchema {
  valueType: ValueType.DATETIME;
  dateFormat?: string;
}

export interface OldPropertySchemaChoice extends OldBasePropertySchema {
  valueType: ValueType.CHOICE;
  enumerations?: PropertyEnumeration[];
  foreignKeyType?: string;
  multiple?: string;
}

export interface OldPropertySchemaBoolean extends OldBasePropertySchema {
  valueType: ValueType.BOOLEAN;
  defaultValue?: boolean;
}

export interface OldPropertySchemaSet extends OldBasePropertySchema {
  valueType: ValueType.SET;
  properties: OldPropertySchema[];
  defaultValue?: Record<string, unknown>;
}

export interface OldPropertySchemaUuid extends OldBasePropertySchema {
  valueType: ValueType.UUID;
}

export interface OldPropertySchemaUrl extends OldBasePropertySchema {
  valueType: ValueType.URL;
  displayMode?: 'in_popup' | 'newTab';
}

export interface OldPropertyFiasSchema extends OldBasePropertySchema {
  valueType: ValueType.FIAS;
  searchMode?: 'address' | 'oktmo';
}

export interface OldPropertyFileSchema extends OldBasePropertySchema {
  valueType: ValueType.FILE;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
}

export interface OldPropertyDocumentSchema extends OldBasePropertySchema {
  valueType: ValueType.DOCUMENT;
  multiple?: boolean;
}

export interface OldPropertyUserSchema extends OldBasePropertySchema {
  valueType: ValueType.USER;
  multiple?: boolean;
  onlySubordinates?: boolean;
}

export interface OldPropertyUserIdSchema extends OldBasePropertySchema {
  valueType: ValueType.USER_ID;
  onlySubordinates?: boolean;
}

export interface OldPropertySchemaCustom extends OldBasePropertySchema {
  valueType: ValueType.CUSTOM;
  ControlComponent: ComponentType<FormControlProps>;
}

export interface OldPropertySchemaOther extends OldBasePropertySchema {
  valueType: ValueType.LOOKUP | ValueType.GEOMETRY | ValueType.CHECKBOX | ValueType.BINARY | ValueType.UUID;
}

export type OldPropertySchema =
  | OldPropertySchemaString
  | OldPropertySchemaText
  | OldPropertySchemaInt
  | OldPropertySchemaLong
  | OldPropertySchemaDouble
  | OldPropertySchemaDatetime
  | OldPropertySchemaBoolean
  | OldPropertySchemaSet
  | OldPropertySchemaChoice
  | OldPropertySchemaOther
  | OldPropertySchemaUrl
  | OldPropertySchemaCustom
  | OldPropertySchemaUuid
  | OldPropertyFiasSchema
  | OldPropertyFileSchema
  | OldPropertyUserSchema
  | OldPropertyUserIdSchema
  | OldPropertyDocumentSchema;

export enum Updateability {
  CREATE_ONLY = 'CREATE_ONLY',
  CREATE_WRITE = 'CREATE_WRITE',
  READ_ONLY = 'READ_ONLY'
}

export interface EditedField {
  name: string;
  value: string | null;
  property: OldPropertySchema;
  isFgistpProperty: boolean;
  relations?: Relation[];
}
