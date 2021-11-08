import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType, PropertySchemaBinary } from '../../../../services/crg/schema.models';
import { FileInput } from '../../../FileInput/FileInput';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

@observer
class FormControlTypeBinary extends Component<FormControlProps> {
  render() {
    const { htmlId, className, errors, property, fieldValue } = this.props;
    const { accept } = property as PropertySchemaBinary;

    return (
      <div className={cnFormControl(null, [className])}>
        <FileInput accept={accept} id={htmlId} onChange={this.handleChange} value={fieldValue as string} />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(selectedFiles: FileList | null) {
    const { onChange, onNeedValidate, property } = this.props;

    if (onChange) {
      onChange({
        value: selectedFiles && selectedFiles[0],
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value: selectedFiles && selectedFiles[0],
        propertyName: property.name
      });
    }
  }
}

export const withTypeBinary = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.BINARY },
  () => FormControlTypeBinary
);
