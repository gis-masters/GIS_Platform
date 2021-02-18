import { SupportedGeometryType } from '../geoserver/wfs.models';

export interface FeatureDescription {
  name: string;
  title: string;
  description: string;
  properties: PropertySchema[];
  tableName: string;
  geometryType: SupportedGeometryType;
  customRuleFunction?: any;
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

export type PropertyEnumerations = { value: string; title: string }[];

export interface PropertySchema {
  name: string;
  title: string;
  description?: string;

  required?: boolean;
  mustBeEmpty?: boolean;
  hidden?: boolean;
  isMultiple?: boolean;

  objectIdentityOnUi?: boolean;

  updateability?: Updateability;
  choice?: any;
  valueType?: any;
  foreignKeyType?: string;

  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
  minInclusive?: number;
  maxInclusive?: number;
  totalDigits?: number;
  fractionDigits?: number;
  allowedValues?: string[];
  enumerations?: PropertyEnumerations;
  dateFormat?: string;
  displayMode?: 'in_popup';
  resourcePath?: string;
}

export enum Updateability {
  CREATE_ONLY = 'CREATE_ONLY',
  CREATE_WRITE = 'CREATE_WRITE',
  READ_ONLY = 'READ_ONLY'
}

export enum FieldType {
  INT = 'INT',
  URL = 'url',
  LOOKUP = 'lookup',
  STRING = 'STRING',
  TEXT = 'TEXT',
  BINARY = 'BINARY',
  CHOICE = 'CHOICE'
}

export interface EditedField {
  name: string;
  value: string;
  property: PropertySchema;
  isFgistpProperty: boolean;
}
