import { List, Paper } from '@mui/material';
import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { SchemaPropertiesItem } from './Item/SchemaProperties-Item';
import { Schema } from '../../services/data/schema/schema.models';

import '!style-loader!css-loader!sass-loader!./SchemaProperties.scss';

const cnSchemaProperties = cn('SchemaProperties');

export interface SchemaPropertiesListProps {
  schema: Schema;
}

export const SchemaProperties: FC<SchemaPropertiesListProps> = ({ schema }) => (
  <Paper className={cnSchemaProperties(null, ['scroll'])} variant='outlined' square>
    <List className={cnSchemaProperties()} dense>
      {schema.properties.map((el, idx) => (
        <SchemaPropertiesItem key={idx} propertySchema={el} />
      ))}
    </List>
  </Paper>
);
