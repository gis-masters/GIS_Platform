import { List } from '@mui/material';
import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { SchemaPropertiesItem } from './Item/SchemaProperties-Item';
import { Schema } from '../../services/data/schema/schema.models';

const cnSchemaProperties = cn('SchemaProperties');

export interface SchemaPropertiesListProps {
  schema: Schema;
}

export const SchemaProperties: FC<SchemaPropertiesListProps> = ({ schema }) => (
  <List className={cnSchemaProperties()} dense>
    {schema.properties.map((el, idx) => (
      <SchemaPropertiesItem key={idx} propertySchema={el} />
    ))}
  </List>
);
