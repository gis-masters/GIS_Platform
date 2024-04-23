import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaBinary } from '../../../../services/data/schema/schema.models';
import { FileInput } from '../../../FileInput/FileInput';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
export default class FormControlTypeBinary extends Component<FormControlProps> {
  render() {
    const { htmlId, className, errors, property, fieldValue } = this.props;
    const { accept, name } = property as PropertySchemaBinary;

    return (
      <div className={cnFormControl(null, [className])}>
        <FileInput accept={accept} id={htmlId} onChange={this.handleChange} value={fieldValue as string} name={name} />
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
