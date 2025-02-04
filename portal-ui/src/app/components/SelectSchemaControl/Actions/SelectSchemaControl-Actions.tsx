import React, { FC } from 'react';

import { Schema } from '../../../services/data/schema/schema.models';
import { SchemaActionsEdit } from '../../SchemaActions/Edit/SchemaActions-Edit';
import { SchemaActionsPreview } from '../../SchemaActions/Preview/SchemaActions-Preview';

interface SelectSchemaControlActionsProps {
  rowData: Schema;
}

export const SelectSchemaControlActions: FC<SelectSchemaControlActionsProps> = ({ rowData }) => (
  <>
    <SchemaActionsEdit readonly schema={rowData} as='iconButton' />
    <SchemaActionsPreview schema={rowData} as='iconButton' />
  </>
);
