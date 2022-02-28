import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaFile, PropertyType } from '../../../../services/crg/schema.models';
import { FileInfo } from '../../../../services/files.service';
import { Files } from '../../../Files/Files';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

@observer
class FormControlTypeFile extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue = [] } = this.props;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <Files
          value={fieldValue as FileInfo[]}
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
