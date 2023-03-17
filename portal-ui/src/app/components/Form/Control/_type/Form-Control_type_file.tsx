import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaFile, PropertyType } from '../../../../services/data/schema/schema.models';
import { FileInfo } from '../../../../services/data/files/files.models';
import { Files } from '../../../Files/Files';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

@observer
class FormControlTypeFile extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue, fullWidthForOldForm } = this.props;
    let value = (fieldValue || []) as FileInfo[];

    try {
      if (fieldValue && typeof fieldValue === 'string') {
        value = JSON.parse(fieldValue) as FileInfo[];
      }
    } catch {
      value = [];
    }

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Files value={value} property={property as PropertySchemaFile} editable onChange={this.handleChange} />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: FileInfo[]) {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value,
        propertyName: property.name
      });
    }
  }
}

export const withTypeFile = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FILE },
  () => FormControlTypeFile
);
