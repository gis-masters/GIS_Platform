import React, { type FC } from 'react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type PropertySchema, type Schema } from '../../services/data/schema/schema.models';
import { SchemaPropertiesItem } from './Item/SchemaProperties-Item';

const cnSchemaProperties = cn('SchemaProperties');

export interface SchemaPropertiesListProps {
  schema: Schema;
  readonly: boolean;
  editing?: boolean;
  propertiesSchemaWithoutContentType?: PropertySchema[];
  onPropertyChange?(newPropertySchema: PropertySchema, oldName?: string): void;
  onPropertyDelete?(propertyName: string): void;
  onPropertyCreate?(): void;
}

export const SchemaProperties: FC<SchemaPropertiesListProps> = ({
  schema,
  readonly,
  editing,
  propertiesSchemaWithoutContentType,
  onPropertyChange,
  onPropertyDelete
}) => (
  <List className={cnSchemaProperties()} dense>
    {schema.properties.map((el, idx) => (
      <SchemaPropertiesItem
        readonly={readonly}
        editing={editing}
        key={idx}
        propertyId={idx}
        propertySchema={el}
        propertySchemaWithoutContentType={
          propertiesSchemaWithoutContentType
            ? propertiesSchemaWithoutContentType.find(item => item.name === el.name)
            : undefined
        }
        onPropertyChange={onPropertyChange}
        onPropertyDelete={onPropertyDelete}
      />
    ))}
  </List>
);
