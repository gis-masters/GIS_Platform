import React from 'react';
import { cn } from '@bem-react/classname';

import { FieldType, EditFeatureItem } from '../../../services/crg/schema.service';

import { EditFeatureFieldControl } from '../Control/EditFeatureField-Control.composed';
import '!style-loader!css-loader!sass-loader!./EditFeatureField-Field.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface EditFeatureFieldFieldProps {
  type: FieldType;
  field: EditFeatureItem;
}

export const EditFeatureFieldField: React.FC<EditFeatureFieldFieldProps> = ({ type, field }) => (
  <div className={cnEditFeatureField('Field')}>
    <EditFeatureFieldControl type={type} field={field} />
  </div>
);
