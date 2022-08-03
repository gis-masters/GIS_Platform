import { PropertyType, Schema } from '../../services/data/schema.models';
import { getFieldRelations } from '../../services/data/schema.utils';

import { XTableRelationsButton } from './RelationsButton/XTable-RelationsButton';
import { XTableColumn } from './XTable';

const filterableTypes = new Set([
  PropertyType.BOOL,
  PropertyType.CHOICE,
  PropertyType.DATETIME,
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

export function getXTableColumnsFromSchema<T>(schema: Schema<T>): XTableColumn<T>[] {
  return schema.properties.map(property => {
    const relations = getFieldRelations<T>(property.name, schema);

    return {
      field: property.name,
      title: property.title,
      description: property.description,
      type: property.propertyType,
      settings: {
        options: property.propertyType === PropertyType.CHOICE ? property.options : undefined,
        format: property.propertyType === PropertyType.DATETIME ? property.format : undefined,
        openIn: property.propertyType === PropertyType.URL ? property.openIn : undefined,
        relations: relations.length ? relations : undefined
      },
      filterable: filterableTypes.has(property.propertyType),
      sortable: sortableTypes.has(property.propertyType),
      headerCellProps: { style: property.minWidth ? { minWidth: String(property.minWidth) + 'px' } : null },
      AfterCellContent: relations?.length ? (XTableRelationsButton as XTableColumn<T>['AfterCellContent']) : undefined,
      cellProps: { padding: smallPaddingTypes.has(property.propertyType) ? 'checkbox' : undefined }
    };
  });
}
