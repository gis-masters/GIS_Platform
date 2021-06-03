import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { ValueType, EditedField } from '../../../services/crg/schema.models';
import { EditFeatureInfo } from '../EditFeatureField';

export const cnEditFeatureFieldControl = cn('EditFeatureField', 'Control');

export interface EditFeaturesControlProps extends IClassNameProps {
  type: ValueType;
  field: EditedField;
  featureInfo: EditFeatureInfo;
}

export const EditFeatureFieldControl: FC<EditFeaturesControlProps> = ({ field }) => (
  <div className={cnEditFeatureFieldControl()}>{field.value}</div>
);
