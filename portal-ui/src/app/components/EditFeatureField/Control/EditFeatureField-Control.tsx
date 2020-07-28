import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { FieldType, EditedField } from '../../../services/crg/schema.service';
import { EditFeatureInfo } from '../EditFeatureField';

export const cnEditFeatureFieldControl = cn('EditFeatureField', 'Control');

export interface EditFeaturesControlProps extends IClassNameProps {
  type: FieldType;
  field: EditedField;
  featureInfo: EditFeatureInfo;
}

export const EditFeatureFieldControl: FC<EditFeaturesControlProps> = ({ field }) => (
  <div className={cnEditFeatureFieldControl()}>
    {field.value}
  </div>
);
