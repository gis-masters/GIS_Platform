import { List } from '@mui/material';
import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { SchemaPropertiesItem } from './Item/SchemaProperties-Item';
import { PropertySchema, Schema } from '../../services/data/schema/schema.models';

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
