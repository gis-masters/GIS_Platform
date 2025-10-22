import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type EditedField, type ValueType } from '../../../services/data/schema/schemaOld.models';
import { type EditFeatureInfo } from '../EditFeatureField.models';

export const cnEditFeatureFieldControl = cn('EditFeatureField', 'Control');

export interface EditFeatureFieldControlProps extends IClassNameProps {
  type: ValueType;
  field: EditedField;
  featureInfo: EditFeatureInfo;
}

export const EditFeatureFieldControlBase: FC<EditFeatureFieldControlProps> = ({ field }) => (
  <div className={cnEditFeatureFieldControl()}>{field.value}</div>
);
