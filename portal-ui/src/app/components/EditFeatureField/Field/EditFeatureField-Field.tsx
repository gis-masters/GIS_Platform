import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type EditedField, type ValueType } from '../../../services/data/schema/schemaOld.models';
import { EditFeatureFieldControl } from '../Control/EditFeatureField-Control.composed';
import { type EditFeatureInfo } from '../EditFeatureField.models';

import './EditFeatureField-Field.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface EditFeatureFieldFieldProps {
  type: ValueType;
  field: EditedField;
  featureInfo: EditFeatureInfo;
}

export const EditFeatureFieldField: FC<EditFeatureFieldFieldProps> = ({ type, field, featureInfo }) => (
  <div className={cnEditFeatureField('Field')}>
    <EditFeatureFieldControl type={type} field={field} featureInfo={featureInfo} />
  </div>
);
