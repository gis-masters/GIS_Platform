import { SupportedGeometryType } from '../geoserver/wfs.models';

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
  CHECKBOX = 'CHECKBOX' // пока что frontend only
}

export interface FeatureDescription<T = Record<string, unknown>> {
  name: string;
  title: string;
  description: string;
  properties: PropertySchema<T>[];
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

export type PropertyEnumerations = { title: string; value: string | number }[];

export interface PropertySchema<T = Record<string, unknown>> {
  name: keyof T;
  title: string;
  valueType: ValueType;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  mustBeEmpty?: boolean;
  updateability?: Updateability;
  objectIdentityOnUi?: boolean;

  // INT DOUBLE
  totalDigits?: number;
  minInclusive?: number;
  maxInclusive?: number;
  measureUnit?: string;

  // DOUBLE
  fractionDigits?: number;

  // STRING TEXT
  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;

  // CHOICE
  isMultiple?: boolean;
  enumerations?: PropertyEnumerations;
  foreignKeyType?: string;

  // DATETIME
  dateFormat?: string;

  // URL
  displayMode?: 'in_popup';

  // SET
  fieldsSet?: PropertySchema[];

  // хз
  choice?: unknown;
  allowedValues?: string[];
  resourcePath?: string;
}

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
