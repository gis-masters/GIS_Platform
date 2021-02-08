import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@material-ui/core';

import { FieldType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeString extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '' } = this.props;

    return (
      <div className={cnFormControl(null, [className])}>
        <TextField id={htmlId} fullWidth value={fieldValue} onChange={this.handleChange} />
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: string }>) {
    const { onChange, property } = this.props;

    onChange({
      value: event.target.value,
      propertyName: property.name
    });
  }
}

export const withTypeString = withBemMod<{}, FormControlProps>(
  cnFormControl(),
  { type: FieldType.STRING },
  () => FormControlTypeString
);
