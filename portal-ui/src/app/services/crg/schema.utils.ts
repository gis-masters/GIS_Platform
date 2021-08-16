import { cloneDeep } from 'lodash';
import { FeatureDescription, PropertySchema, ValueType } from './schema.models';
import {
  FieldType,
  NewPropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaUrl
} from './schemaNew.models';

export function getSchemaWithAppliedContentType(schema: FeatureDescription, contentTypeId: string): FeatureDescription {
  const clonedSchema: FeatureDescription = cloneDeep(schema);

  const contentType = clonedSchema.contentTypes.find(cType => cType.id === contentTypeId);
  if (contentType) {
    const actualProperties: PropertySchema[] = contentType.attributes.map(contentTypeDescription => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeDescription.name);

      return { ...schemaProperty, ...contentTypeDescription };
    });

    clonedSchema.properties = [...actualProperties];
  }

  return clonedSchema;
}

export function convertSchema<T extends Record<string, unknown>>(
  oldFields: PropertySchema<T>[]
): NewPropertySchema<T>[] {
  return oldFields.map(oldField => {
    const field: Partial<NewPropertySchema<T>> = { ...oldField };

    if (oldField.valueType === ValueType.STRING || oldField.valueType === ValueType.TEXT) {
      field.fieldType = FieldType.STRING;
    }

    field.isTitle = oldField.objectIdentityOnUi;

    if (oldField.valueType === ValueType.DOUBLE) {
      field.fieldType = FieldType.FLOAT;

      (field as Partial<PropertySchemaFloat>).precision = oldField.fractionDigits;
    }

    if (oldField.valueType === ValueType.INT) {
      field.fieldType = FieldType.INT;
    }

    if (oldField.valueType === ValueType.CHECKBOX) {
      field.fieldType = FieldType.BOOL;
    }

    if (oldField.valueType === ValueType.DATETIME) {
      field.fieldType = FieldType.DATETIME;

      (field as Partial<PropertySchemaDatetime>).format = oldField.dateFormat;
    }

    if (oldField.valueType === ValueType.CHOICE) {
      field.fieldType = FieldType.CHOICE;

      (field as Partial<PropertySchemaChoice>).multiple = oldField.isMultiple;

      (field as Partial<PropertySchemaChoice>).options = oldField.enumerations;
    }

    if (oldField.valueType === ValueType.URL) {
      field.fieldType = FieldType.URL;

      (field as Partial<PropertySchemaUrl>).display =
        oldField.displayMode === 'in_popup' ? 'popup' : oldField.displayMode;
    }

    if (oldField.valueType === ValueType.GEOMETRY) {
      field.fieldType = FieldType.GEOMETRY;
    }

    if (oldField.valueType === ValueType.LOOKUP) {
      field.fieldType = FieldType.LOOKUP;
    }

    if (oldField.valueType === ValueType.BINARY) {
      field.fieldType = FieldType.BINARY;
    }

    if (oldField.valueType === ValueType.SET) {
      field.fieldType = FieldType.SET;
    }

    delete (field as Partial<PropertySchema>).valueType;

    return field as NewPropertySchema<T>;
  });
}
