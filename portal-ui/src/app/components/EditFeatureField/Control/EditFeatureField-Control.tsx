import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { FieldType, EditFeatureItem } from '../../../services/crg/schema.service';

export const cnEditFeatureFieldControl = cn('EditFeatureField', 'Control');

export interface EditFeaturesControlProps extends IClassNameProps {
  type: FieldType;
  field: EditFeatureItem;
}

export const EditFeatureFieldControl: FC<EditFeaturesControlProps> = ({ field }) => (
  <div className={cnEditFeatureFieldControl()}>{field.value}</div>
);
