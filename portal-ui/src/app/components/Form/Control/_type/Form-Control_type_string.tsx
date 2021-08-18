import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@material-ui/core';

import { FieldType } from '../../../../services/crg/schemaNew.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeString extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', inSet, property, error } = this.props;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          id={htmlId}
          fullWidth={!inSet}
          value={fieldValue}
          error={!!error}
          helperText={error}
          label={inSet ? property.title : undefined}
          onChange={this.handleChange}
        />
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

export const withTypeString = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.STRING },
  () => FormControlTypeString
);
