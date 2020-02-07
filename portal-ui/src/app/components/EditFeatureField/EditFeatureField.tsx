import React from 'react';
import { cn } from '@bem-react/classname';

import { FieldType, EditFeatureItem } from '../../services/crg/data-schema.service';

import { EditFeatureFieldField } from './Field/EditFeatureField-Field';
import { EditFeatureFieldLabel } from './Label/EditFeatureField-Label';

import '!style-loader!css-loader!sass-loader!./EditFeatureField.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface EditFeatureFieldProps {
  type: FieldType;
  field: EditFeatureItem;
}

export class EditFeatureField extends React.Component<EditFeatureFieldProps> {
  render () {
    const { type, field } = this.props;

    return (
      <div className={cnEditFeatureField({ type: this.props.type })}>
        <EditFeatureFieldLabel>
          {field.property.title}
        </EditFeatureFieldLabel>
        <EditFeatureFieldField type={type} field={field} />
      </div>
    );
  }
}
