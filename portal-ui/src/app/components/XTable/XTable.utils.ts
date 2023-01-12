import { PropertyType, Schema } from '../../services/data/schema.models';
import { getFieldRelations } from '../../services/data/schema.utils';

import { XTableRelationsButton } from './RelationsButton/XTable-RelationsButton';
import { XTableColumn } from './XTable';

const filterableTypes = new Set([
  PropertyType.BOOL,
  PropertyType.CHOICE,
  PropertyType.DATETIME,
  PropertyType.DOCUMENT,
  PropertyType.FLOAT,
  PropertyType.INT,
  PropertyType.STRING
]);

const sortableTypes = new Set([
  PropertyType.BOOL,
  PropertyType.CALCULATED,
  PropertyType.CHOICE,
  PropertyType.DATETIME,
  PropertyType.DURATION,
  PropertyType.FLOAT,
  PropertyType.INT,
  PropertyType.STRING,
  PropertyType.TIME
]);

const smallPaddingTypes = new Set([PropertyType.FILE, PropertyType.DOCUMENT, PropertyType.URL]);

export function getXTableColumnsFromSchema<T>(schema: Schema, overrides?: XTableColumn<T>[]): XTableColumn<T>[] {
  return _getXTableColumnsFromSchema(schema, false, overrides) as XTableColumn<T>[];
}

export function defaultRowIdGetter<T extends { id?: string | number; identifier?: string; name?: string }>({
  id,
  identifier,
  name
}: T): string | number {
  return id || identifier || name;
}

export function getXTableColumnsFromSchemaWithLowerCaseKeys(
  schema: Schema,
  overrides?: XTableColumn<Record<string, unknown>>[]
): XTableColumn<Record<string, unknown>>[] {
  return _getXTableColumnsFromSchema(schema, true, overrides);
}

function _getXTableColumnsFromSchema<T>(
  schema: Schema,
  keysToLowerCase: boolean,
  overrides: XTableColumn<T>[] = []
): XTableColumn<Record<string, unknown> | T>[] {
  const allowedProperties = schema.properties.filter(property => property.propertyType !== PropertyType.LOOKUP);

  return allowedProperties.map(property => {
    const relations = getFieldRelations(property.name, schema);
    const override = overrides.find(({ field }) =>
      keysToLowerCase ? property.name.toLowerCase() === String(field).toLowerCase() : property.name === field
    );

    return {
      field: keysToLowerCase ? property.name.toLowerCase() : property.name,
      title: property.title || property.name,
      description: property.description,
      type: property.propertyType,
      settings: {
        options: property.propertyType === PropertyType.CHOICE ? property.options : undefined,
        format: property.propertyType === PropertyType.DATETIME ? property.format : undefined,
        openIn: property.propertyType === PropertyType.URL ? property.openIn : undefined,
        relations: relations.length ? relations : undefined
      },
      filterable: filterableTypes.has(property.propertyType),
      hidden: property.hidden,
      sortable: sortableTypes.has(property.propertyType),
      minWidth: property.minWidth,
      AfterCellContent: relations?.length ? (XTableRelationsButton as XTableColumn<T>['AfterCellContent']) : undefined,
      cellProps: { padding: smallPaddingTypes.has(property.propertyType) ? 'checkbox' : undefined },

      ...override
    } as XTableColumn<Record<string, unknown> | T>;
  });
}
