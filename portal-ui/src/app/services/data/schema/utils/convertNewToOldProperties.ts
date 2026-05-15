import {
  type PropertySchema,
  type PropertySchemaChoice,
  type PropertySchemaDatetime,
  type PropertySchemaFloat,
  type PropertySchemaString,
  type PropertySchemaUrl,
  PropertyType
} from '../schema.models';
import {
  type OldPropertySchema,
  type OldPropertySchemaChoice,
  type OldPropertySchemaDatetime,
  type OldPropertySchemaDouble,
  type OldPropertySchemaString,
  type OldPropertySchemaUrl,
  ValueType
} from '../schemaOld.models';

export function convertNewToOldProperties(newFields: PropertySchema[]): OldPropertySchema[] {
  return newFields.map(newField => {
    const field: Partial<OldPropertySchema> = {
      ...newField
    } as Partial<OldPropertySchema>;

    if (newField.propertyType === PropertyType.STRING) {
      field.valueType = ValueType.STRING;

      if (newField.regex) {
        (field as Partial<OldPropertySchemaString>).pattern = newField.regex;
        delete (field as Partial<PropertySchemaString>).regex;
      }

      if (newField.regexErrorMessage) {
        (field as Partial<OldPropertySchemaString>).patternDescription = newField.regexErrorMessage;
        delete (field as Partial<PropertySchemaString>).regexErrorMessage;
      }
    }

    if (newField.propertyType === PropertyType.FLOAT) {
      field.valueType = ValueType.DOUBLE;

      (field as Partial<OldPropertySchemaDouble>).fractionDigits = newField.precision;
      delete (field as Partial<PropertySchemaFloat>).precision;
    }

    if (newField.propertyType === PropertyType.TEXT) {
      field.valueType = ValueType.TEXT;
    }

    if (newField.propertyType === PropertyType.INT) {
      field.valueType = ValueType.INT;
    }

    if (newField.propertyType === PropertyType.LONG) {
      field.valueType = ValueType.LONG;
    }

    if (newField.propertyType === PropertyType.BOOL) {
      field.valueType = ValueType.CHECKBOX;
    }

    if (newField.propertyType === PropertyType.BOOL) {
      field.valueType = ValueType.BOOLEAN;
    }

    if (newField.propertyType === PropertyType.DATETIME) {
      field.valueType = ValueType.DATETIME;

      (field as Partial<OldPropertySchemaDatetime>).dateFormat = newField.format;
      delete (field as Partial<PropertySchemaDatetime>).format;
    }

    if (newField.propertyType === PropertyType.CHOICE) {
      field.valueType = ValueType.CHOICE;

      (field as Partial<OldPropertySchemaChoice>).enumerations = newField.options;
      delete (field as Partial<PropertySchemaChoice>).options;
    }

    if (newField.propertyType === PropertyType.URL) {
      field.valueType = ValueType.URL;

      if (newField.openIn) {
        (field as Partial<OldPropertySchemaUrl>).displayMode = newField.openIn === 'popup' ? 'in_popup' : 'newTab';
      } else {
        (field as Partial<OldPropertySchemaUrl>).displayMode = undefined;
      }
      delete (field as Partial<PropertySchemaUrl>).openIn;
    }

    if (newField.propertyType === PropertyType.LOOKUP) {
      field.valueType = ValueType.LOOKUP;
    }

    if (newField.propertyType === PropertyType.BINARY) {
      field.valueType = ValueType.BINARY;
    }

    if (newField.propertyType === PropertyType.SET) {
      field.valueType = ValueType.SET;
    }

    if (newField.propertyType === PropertyType.FIAS) {
      field.valueType = ValueType.FIAS;
    }

    if (newField.propertyType === PropertyType.FILE) {
      field.valueType = ValueType.FILE;
    }

    if (newField.propertyType === PropertyType.VERSIONS) {
      field.valueType = ValueType.VERSIONS;
    }

    if (newField.propertyType === PropertyType.DOCUMENT) {
      field.valueType = ValueType.DOCUMENT;
    }

    if (newField.propertyType === PropertyType.USER) {
      field.valueType = ValueType.USER;
    }

    if (newField.propertyType === PropertyType.USER_ID) {
      field.valueType = ValueType.USER_ID;
    }

    if (newField.propertyType === PropertyType.GEOMETRY) {
      field.valueType = ValueType.GEOMETRY;
    }

    if (newField.propertyType === PropertyType.UUID) {
      field.valueType = ValueType.UUID;
    }

    delete (field as Partial<PropertySchema>).propertyType;

    return field as OldPropertySchema;
  });
}
