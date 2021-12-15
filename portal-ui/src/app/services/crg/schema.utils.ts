import { cloneDeep } from 'lodash';
import { OldFeatureDescription, OldPropertySchema, ValueType } from './schemaOld.models';
import {
  PropertyType,
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaUrl
} from './schema.models';

export function getSchemaWithAppliedContentType(
  schema: OldFeatureDescription,
  contentTypeId?: string
): OldFeatureDescription {
  const clonedSchema: OldFeatureDescription = cloneDeep(schema);

  const contentType = clonedSchema.contentTypes.find(cType => cType.id === contentTypeId);
  if (contentType) {
    const actualProperties: OldPropertySchema[] = contentType.attributes.map(contentTypeDescription => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeDescription.name);

      return { ...schemaProperty, ...contentTypeDescription };
    });

    clonedSchema.properties = [...actualProperties];
  }

  return clonedSchema;
}

export function convertSchema<T extends Record<string, unknown>>(
  oldFields: OldPropertySchema<T>[]
): PropertySchema<T>[] {
  return oldFields.map(oldField => {
    const field: Partial<PropertySchema<T>> = { ...oldField };

    if (oldField.valueType === ValueType.STRING || oldField.valueType === ValueType.TEXT) {
      field.propertyType = PropertyType.STRING;
    }

    field.asTitle = oldField.objectIdentityOnUi;

    if (oldField.valueType === ValueType.DOUBLE) {
      field.propertyType = PropertyType.FLOAT;

      (field as Partial<PropertySchemaFloat>).precision = oldField.fractionDigits;
    }

    if (oldField.valueType === ValueType.INT) {
      field.propertyType = PropertyType.INT;
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
    }

    if (oldField.valueType === ValueType.CHOICE) {
      field.propertyType = PropertyType.CHOICE;

      (field as Partial<PropertySchemaChoice>).multiple = oldField.isMultiple;

      (field as Partial<PropertySchemaChoice>).options = oldField.enumerations;
    }

    if (oldField.valueType === ValueType.URL) {
      field.propertyType = PropertyType.URL;

      (field as Partial<PropertySchemaUrl>).display =
        oldField.displayMode === 'in_popup' ? 'popup' : oldField.displayMode;
    }

    if (oldField.valueType === ValueType.GEOMETRY) {
      field.propertyType = PropertyType.GEOMETRY;
    }

    if (oldField.valueType === ValueType.LOOKUP) {
      field.propertyType = PropertyType.LOOKUP;
    }

    if (oldField.valueType === ValueType.BINARY) {
      field.propertyType = PropertyType.BINARY;
    }

    if (oldField.valueType === ValueType.SET) {
      field.propertyType = PropertyType.SET;
    }

    if (oldField.valueType === ValueType.FIAS) {
      field.propertyType = PropertyType.FIAS;
    }

    delete (field as Partial<OldPropertySchema>).valueType;

    return field as PropertySchema<T>;
  });
}
