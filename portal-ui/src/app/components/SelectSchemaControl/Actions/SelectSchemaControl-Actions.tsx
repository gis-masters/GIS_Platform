import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Schema } from '../../../services/data/schema/schema.models';
import { SchemaActionsPreview } from '../../SchemaActions/Preview/SchemaActions-Preview';
import { OpenSchemaAction } from '../../OpenSchemaAction/OpenSchemaAction';

const cnSelectSchemaControlActions = cn('SelectSchemaControl', 'Actions');

interface SelectSchemaControlActionsProps {
  rowData: Schema;
}

export const SelectSchemaControlActions: FC<SelectSchemaControlActionsProps> = ({ rowData }) => (
  <>
    <OpenSchemaAction className={cnSelectSchemaControlActions()} schema={rowData} />
    <SchemaActionsPreview schema={rowData} as='iconButton' />
  </>
);
