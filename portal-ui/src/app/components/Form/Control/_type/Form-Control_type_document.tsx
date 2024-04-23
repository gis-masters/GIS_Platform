import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaDocument, PropertyType } from '../../../../services/data/schema/schema.models';
import { DocumentInfo, Documents } from '../../../Documents/Documents';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeDocument extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue, fullWidthForOldForm } = this.props;

    let value: DocumentInfo[];

    try {
      value = JSON.parse(String(fieldValue)) as DocumentInfo[];
      if (!Array.isArray(value)) {
        value = [];
      }
    } catch {
      value = [];
    }

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Documents property={property as PropertySchemaDocument} value={value} editable onChange={this.handleChange} />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: DocumentInfo[]) {
    const { onChange, property } = this.props;

    if (onChange && property) {
      onChange({
        value: JSON.stringify(value),
        propertyName: property.name
      });
    }
  }
}

export const withTypeDocument = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.DOCUMENT },
  () => FormControlTypeDocument
);
