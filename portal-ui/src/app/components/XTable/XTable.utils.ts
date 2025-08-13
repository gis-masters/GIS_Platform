import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { getFieldRelations } from '../../services/data/schema/schema.utils';
import { XTableRelationsButton } from './RelationsButton/XTable-RelationsButton';
import { XTableColumn } from './XTable.models';

const filterableTypes = new Set([
  PropertyType.BOOL,
  PropertyType.CHOICE,
  PropertyType.DATETIME,
  PropertyType.DOCUMENT,
  PropertyType.FLOAT,
  PropertyType.USER_ID,
  PropertyType.USER,
  PropertyType.INT,
  PropertyType.LONG,
  PropertyType.STRING,
  PropertyType.TEXT,
  PropertyType.FIAS
]);

const sortableTypes = new Set([
  PropertyType.BOOL,
  PropertyType.CHOICE,
  PropertyType.USER_ID,
  PropertyType.USER,
  PropertyType.DATETIME,
  PropertyType.FLOAT,
  PropertyType.INT,
  PropertyType.LONG,
  PropertyType.STRING,
  PropertyType.TEXT,
  PropertyType.TIME
]);

const smallPaddingTypes = new Set([PropertyType.FILE, PropertyType.DOCUMENT, PropertyType.URL]);

export function getXTableColumnsFromSchema<T>(schema: Schema, overrides?: XTableColumn<T>[]): XTableColumn<T>[] {
  return _getXTableColumnsFromSchema(schema, overrides);
}

export function defaultRowIdGetter<T>(data: T): string | number {
  const { id, identifier, table_name: tableName, name } = (data || {}) as Record<string, unknown>;

  if (id && (typeof id === 'string' || typeof id === 'number')) {
    return id;
  }

  if (identifier && typeof identifier === 'string') {
    return identifier;
  }

  if (tableName && typeof tableName === 'string') {
    return tableName;
  }

  if (name && typeof name === 'string') {
    return name;
  }

  throw new Error('Invalid data for defaultRowIdGetter');
}

function _getXTableColumnsFromSchema<T>(schema: Schema, overrides: XTableColumn<T>[] = []): XTableColumn<T>[] {
  const allowedProperties = schema.properties.filter(property => property.propertyType !== PropertyType.LOOKUP);

  return allowedProperties.map(property => {
    const relations = getFieldRelations(property.name, schema);
    const override = overrides.find(({ field }) => property.name === field);

    return {
      field: property.name,
      title: property.title || property.name,
      description: property.description,
      type: property.propertyType,
      settings: {
        options: property.propertyType === PropertyType.CHOICE ? property.options : undefined,
        format: property.propertyType === PropertyType.DATETIME ? property.format : undefined,
        openIn: property.propertyType === PropertyType.URL ? property.openIn : undefined,
        relations: relations.length ? relations : undefined,
        precision: property.propertyType === PropertyType.FLOAT ? property?.precision : undefined
      },
      filterable: filterableTypes.has(property.propertyType),
      hidden: property.hidden,
      sortable: sortableTypes.has(property.propertyType),
      minWidth: property.minWidth,
      maxDefaultWidth:
        property.propertyType === PropertyType.CHOICE || property.propertyType === PropertyType.STRING
          ? property.maxDefaultWidth
          : undefined,
      width: property.defaultWidth || undefined,
      BeforeCellContent: relations?.length
        ? (XTableRelationsButton as XTableColumn<T>['BeforeCellContent'])
        : undefined,
      AfterCellContent: relations?.length ? (XTableRelationsButton as XTableColumn<T>['AfterCellContent']) : undefined,
      cellProps: { padding: smallPaddingTypes.has(property.propertyType) ? 'checkbox' : undefined },

      ...override
    } as XTableColumn<T>;
  });
}
