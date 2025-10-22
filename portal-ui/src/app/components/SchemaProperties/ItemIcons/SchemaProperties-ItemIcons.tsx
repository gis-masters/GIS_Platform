import React, { type FC } from 'react';
import { ListItemSecondaryAction } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import '../ItemIcons/SchemaProperties-ItemIcons.scss';

const cnSchemaPropertiesItemIcons = cn('SchemaProperties', 'ItemIcons');

export const SchemaPropertiesItemIcons: FC<ChildrenProps> = ({ children }) => (
  <ListItemSecondaryAction className={cnSchemaPropertiesItemIcons()}>{children}</ListItemSecondaryAction>
);
