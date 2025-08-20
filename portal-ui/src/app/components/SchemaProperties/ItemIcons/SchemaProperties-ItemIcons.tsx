import React, { FC } from 'react';
import { ListItemSecondaryAction } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!../ItemIcons/SchemaProperties-ItemIcons.scss';

const cnSchemaPropertiesItemIcons = cn('SchemaProperties', 'ItemIcons');

export const SchemaPropertiesItemIcons: FC<ChildrenProps> = ({ children }) => (
  <ListItemSecondaryAction className={cnSchemaPropertiesItemIcons()}>{children}</ListItemSecondaryAction>
);
