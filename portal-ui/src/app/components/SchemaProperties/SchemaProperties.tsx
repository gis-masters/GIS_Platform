import React, { FC } from 'react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';

import { PropertySchema, Schema } from '../../services/data/schema/schema.models';
import { SchemaPropertiesItem } from './Item/SchemaProperties-Item';

const cnSchemaProperties = cn('SchemaProperties');

export interface SchemaPropertiesListProps {
  schema: Schema;
  readonly: boolean;
  onPropertyChange?(newPropertySchema: PropertySchema): void;
}

export const SchemaProperties: FC<SchemaPropertiesListProps> = ({ schema, readonly, onPropertyChange }) => (
  <List className={cnSchemaProperties()} dense>
    {schema.properties.map((el, idx) => (
      <SchemaPropertiesItem readonly={readonly} key={idx} propertySchema={el} onPropertyChange={onPropertyChange} />
    ))}
  </List>
);
