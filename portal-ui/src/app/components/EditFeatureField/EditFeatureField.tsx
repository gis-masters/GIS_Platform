import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import { type EditedField, type ValueType } from '../../services/data/schema/schemaOld.models';
import { type EditFeatureInfo } from './EditFeatureField.models';
import { EditFeatureFieldField } from './Field/EditFeatureField-Field';
import { EditFeatureFieldLabel } from './Label/EditFeatureField-Label';

import './EditFeatureField.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface EditFeatureFieldProps {
  type: ValueType;
  field: EditedField;
  featureInfo: EditFeatureInfo;
}

export class EditFeatureField extends Component<EditFeatureFieldProps> {
  render() {
    const { type, field, featureInfo } = this.props;

    return (
      <div className={cnEditFeatureField({ type })}>
        <EditFeatureFieldLabel>{field.property.title}</EditFeatureFieldLabel>
        <EditFeatureFieldField type={type} field={field} featureInfo={featureInfo} />
      </div>
    );
  }
}
