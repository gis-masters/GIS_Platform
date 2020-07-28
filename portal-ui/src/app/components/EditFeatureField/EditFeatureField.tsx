import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import { FieldType, EditedField } from '../../services/crg/schema.service';
import { WfsFeature } from '../../services/geoserver/wfs-models';

import { EditFeatureFieldField } from './Field/EditFeatureField-Field';
import { EditFeatureFieldLabel } from './Label/EditFeatureField-Label';

import '!style-loader!css-loader!sass-loader!./EditFeatureField.scss';

const cnEditFeatureField = cn('EditFeatureField');

export interface EditFeatureInfo {
  layerName: string;
  feature: WfsFeature;
  isReadOnly: boolean;
  isNew?: boolean;
}

interface EditFeatureFieldProps {
  type: FieldType;
  field: EditedField;
  featureInfo: EditFeatureInfo;
}

export class EditFeatureField extends Component<EditFeatureFieldProps> {
  render() {
    const { type, field, featureInfo } = this.props;

    return (
      <div className={cnEditFeatureField({ type: this.props.type })}>
        <EditFeatureFieldLabel>{field.property.title}</EditFeatureFieldLabel>
        <EditFeatureFieldField type={type} field={field} featureInfo={featureInfo} />
      </div>
    );
  }
}
