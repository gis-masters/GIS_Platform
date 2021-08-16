import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { FileInput } from '../../../FileInput/FileInput';
import { FieldType } from '../../../../services/crg/schemaNew.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeBinary extends Component<FormControlProps> {
  render() {
    const { htmlId, className } = this.props;

    return (
      <div className={cnFormControl(null, [className])}>
        <FileInput id={htmlId} onChange={this.handleChange} />
      </div>
    );
  }

  @boundMethod
  private handleChange(selectedFiles: FileList | null) {
    const { onChange, property } = this.props;

    onChange({
      value: selectedFiles[0],
      propertyName: property.name
    });
  }
}

export const withTypeBinary = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.BINARY },
  () => FormControlTypeBinary
);
