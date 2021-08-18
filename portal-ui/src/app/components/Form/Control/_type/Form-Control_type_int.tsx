import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { InputAdornment, TextField } from '@material-ui/core';

import { FieldType, PropertySchemaInt } from '../../../../services/crg/schemaNew.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeInt extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', property, inSet, error } = this.props;
    const { measureUnit, title } = property as PropertySchemaInt;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          id={htmlId}
          fullWidth={!inSet}
          type='number'
          InputProps={{
            endAdornment: measureUnit ? <InputAdornment position='end'>{measureUnit}</InputAdornment> : undefined
          }}
          value={fieldValue}
          label={inSet ? title : undefined}
          onChange={this.handleChange}
          error={!!error}
          helperText={error}
        />
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    const { onChange, property } = this.props;
    const { maxValue, minValue } = property as PropertySchemaInt;

    let value = Number(event.target.value || 0);

    if (typeof maxValue === 'number' && value > maxValue) {
      value = maxValue;
    }

    if (typeof minValue === 'number' && value < minValue) {
      value = minValue;
    }

    onChange({
      value,
      propertyName: property.name
    });
  }
}

export const withTypeInt = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.INT },
  () => FormControlTypeInt
);
