import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { InputAdornment, TextField } from '@mui/material';

import { PropertyType, PropertySchemaFloat } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeFloat extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', property, inSet, errors } = this.props;
    const { measureUnit, title, defaultValue } = property as PropertySchemaFloat;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          id={htmlId}
          fullWidth={!inSet}
          type='number'
          InputProps={{
            endAdornment: measureUnit ? <InputAdornment position='end'>{measureUnit}</InputAdornment> : undefined
          }}
          value={fieldValue === undefined ? defaultValue : fieldValue}
          label={inSet ? title : undefined}
          onChange={this.handleChange}
          error={!!errors?.length}
          helperText={errors}
          onBlur={this.handleBlur}
          variant='standard'
        />
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    const { onChange, property } = this.props;
    const { precision } = property as PropertySchemaFloat;
    const targetValue = event.target.value;

    let value = targetValue ? Number(targetValue) : targetValue;

    if (targetValue && typeof precision === 'number') {
      value = Number(Number(value).toFixed(precision));
    }

    if (onChange) {
      onChange({ value, propertyName: property.name });
    }
  }

  @boundMethod
  private handleBlur() {
    const { onNeedValidate, fieldValue, property } = this.props;

    if (onNeedValidate) {
      onNeedValidate({
        value: fieldValue,
        propertyName: property.name
      });
    }
  }
}

export const withTypeFloat = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FLOAT },
  () => FormControlTypeFloat
);
