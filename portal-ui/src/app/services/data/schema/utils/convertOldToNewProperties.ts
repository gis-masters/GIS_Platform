import {
  type PropertySchema,
  type PropertySchemaChoice,
  type PropertySchemaDatetime,
  type PropertySchemaFloat,
  type PropertySchemaSet,
  type PropertySchemaString,
  type PropertySchemaUrl,
  PropertyType
} from '../schema.models';
import {
  type OldPropertySchema,
  type OldPropertySchemaChoice,
  type OldPropertySchemaDatetime,
  type OldPropertySchemaDouble,
  type OldPropertySchemaSet,
  type OldPropertySchemaString,
  type OldPropertySchemaUrl,
  ValueType
} from '../schemaOld.models';

export function convertOldToNewProperties(oldFields: OldPropertySchema[]): PropertySchema[] {
  return oldFields?.map(oldField => {
    const field: Partial<PropertySchema> = { ...oldField } as OldPropertySchema;

    if (oldField.valueType === ValueType.STRING) {
      field.propertyType = PropertyType.STRING;

      if (oldField.pattern) {
        (field as Partial<PropertySchemaString>).regex = oldField.pattern;
        delete (field as Partial<OldPropertySchemaString>).pattern;
      }

      if (oldField.patternDescription) {
        (field as Partial<PropertySchemaString>).regexErrorMessage = oldField.patternDescription;
        delete (field as Partial<OldPropertySchemaString>).patternDescription;
      }
    }

    if (oldField.objectIdentityOnUi !== undefined) {
      field.asTitle = field.asTitle ?? oldField.objectIdentityOnUi;
      delete (field as Partial<OldPropertySchemaDouble>).objectIdentityOnUi;
    }

    if (oldField.valueType === ValueType.DOUBLE) {
      field.propertyType = PropertyType.FLOAT;

      (field as Partial<PropertySchemaFloat>).precision = oldField.fractionDigits;
      delete (field as Partial<OldPropertySchemaDouble>).fractionDigits;
    }

    if (oldField.valueType === ValueType.TEXT) {
      field.propertyType = PropertyType.TEXT;
    }

    if (oldField.valueType === ValueType.INT) {
      field.propertyType = PropertyType.INT;
    }

    if (oldField.valueType === ValueType.LONG) {
      field.propertyType = PropertyType.LONG;
    }

    if (oldField.valueType === ValueType.CHECKBOX) {
      field.propertyType = PropertyType.BOOL;
    }

    if (oldField.valueType === ValueType.BOOLEAN) {
      field.propertyType = PropertyType.BOOL;
    }

    if (oldField.valueType === ValueType.DATETIME) {
      field.propertyType = PropertyType.DATETIME;

      (field as Partial<PropertySchemaDatetime>).format = oldField.dateFormat;
      delete (field as Partial<OldPropertySchemaDatetime>).dateFormat;
    }

    if (oldField.valueType === ValueType.CHOICE) {
      field.propertyType = PropertyType.CHOICE;

      (field as Partial<PropertySchemaChoice>).options = oldField.enumerations;
      delete (field as Partial<OldPropertySchemaChoice>).enumerations;
    }

    if (oldField.valueType === ValueType.URL) {
      field.propertyType = PropertyType.URL;
      if (oldField.displayMode) {
        (field as Partial<PropertySchemaUrl>).openIn = oldField.displayMode === 'in_popup' ? 'popup' : 'newTab';
        delete (field as Partial<OldPropertySchemaUrl>).displayMode;
      }
    }

    if (oldField.valueType === ValueType.LOOKUP) {
      field.propertyType = PropertyType.LOOKUP;
    }

    if (oldField.valueType === ValueType.BINARY) {
      field.propertyType = PropertyType.BINARY;
    }

    if (oldField.valueType === ValueType.SET) {
      (field as PropertySchema as PropertySchemaSet).propertyType = PropertyType.SET;
      (field as PropertySchema as PropertySchemaSet).properties = convertOldToNewProperties(
        (oldField as OldPropertySchema as OldPropertySchemaSet).properties
      );
    }

    if (oldField.valueType === ValueType.FIAS) {
      field.propertyType = PropertyType.FIAS;
    }

    if (oldField.valueType === ValueType.FILE) {
      field.propertyType = PropertyType.FILE;
    }

    if (oldField.valueType === ValueType.VERSIONS) {
      field.propertyType = PropertyType.VERSIONS;
    }

    if (oldField.valueType === ValueType.DOCUMENT) {
      field.propertyType = PropertyType.DOCUMENT;
    }

    if (oldField.valueType === ValueType.USER) {
      field.propertyType = PropertyType.USER;
    }

    if (oldField.valueType === ValueType.USER_ID) {
      field.propertyType = PropertyType.USER_ID;
    }

    if (oldField.valueType === ValueType.GEOMETRY) {
      field.propertyType = PropertyType.GEOMETRY;
    }

    if (oldField.valueType === ValueType.UUID) {
      field.propertyType = PropertyType.UUID;
    }

    delete (field as Partial<OldPropertySchema>).valueType;

    return field as PropertySchema;
  });
}
