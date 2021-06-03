import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@material-ui/core';

import { ValueType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeInt extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '' } = this.props;

    return (
      <div className={cnFormControl(null, [className])}>
        <TextField id={htmlId} fullWidth type='number' value={fieldValue} onChange={this.handleChange} />
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    const { onChange, property } = this.props;

    onChange({
      value: event.target.value,
      propertyName: property.name
    });
  }
}

export const withTypeInt = withBemMod<{}, FormControlProps>(
  cnFormControl(),
  { type: ValueType.INT },
  () => FormControlTypeInt
);
