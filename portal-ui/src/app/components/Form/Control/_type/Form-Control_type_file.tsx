import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { FileInfo } from '../../../../services/data/files/files.models';
import { LibraryRecord } from '../../../../services/data/library/library.models';
import { PropertySchemaFile, PropertyType } from '../../../../services/data/schema/schema.models';
import { Files } from '../../../Files/Files';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeFile extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, formRole, errors, fieldValue, formValue, fullWidthForOldForm } = this.props;
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
        <Files
          showPlaceAction={formRole === 'viewDocument'}
          document={formRole === 'viewDocument' ? (formValue as LibraryRecord) : undefined}
          value={value}
          property={property as PropertySchemaFile}
          editable
          onChange={this.handleChange}
        />
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
