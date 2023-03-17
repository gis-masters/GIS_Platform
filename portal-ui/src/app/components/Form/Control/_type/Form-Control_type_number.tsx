import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { InputAdornment, Slider, TextField } from '@mui/material';

import { PropertySchemaNumber } from '../../../../services/data/schema/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_number.scss';

@observer
export class FormControlTypeNumber extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue, property, inSet, errors, variant = 'standard' } = this.props;
    const { measureUnit, title, minValue, maxValue, step, display = 'number', name } = property as PropertySchemaNumber;

    return (
      <div className={cnFormControl({ inSet, type: 'number', display }, [className])}>
        {display === 'number' && (
          <TextField
            id={htmlId}
            name={name}
            fullWidth={!inSet}
            type='number'
            InputProps={{
              endAdornment: measureUnit ? <InputAdornment position='end'>{measureUnit}</InputAdornment> : undefined,
              inputProps: { step, min: minValue, max: maxValue }
            }}
            value={fieldValue === undefined || fieldValue === null ? '' : fieldValue}
            label={inSet ? title : undefined}
            onChange={this.handleNumberChange}
            error={!!errors?.length}
            helperText={errors}
            onBlur={this.handleNeedValidate}
            variant={variant}
          />
        )}

        {display === 'slider' && (
          <>
            <Slider
              value={Number(fieldValue === undefined || fieldValue === null ? '' : fieldValue) || minValue}
              valueLabelDisplay='auto'
              min={minValue}
              max={maxValue}
              step={step}
              onChange={this.handleSliderChange}
            />
            <FormErrors errors={errors} />
          </>
        )}
      </div>
    );
  }

  @boundMethod
  private handleNumberChange(event: React.ChangeEvent<{ value: string }>) {
    const targetValue = event.target.value;
    const value = targetValue ? Number(targetValue) : null;

    this.change(value);
  }

  @boundMethod
  private handleSliderChange(event: Event, value: number) {
    this.change(value);
    this.handleNeedValidate();
  }

  private change(value: number | string | undefined) {
    const { onChange, property } = this.props;

    const { maxValue } = property as PropertySchemaNumber;

    if (typeof maxValue === 'number' && value > maxValue) {
      value = maxValue;
    }

    if (onChange) {
      onChange({ value, propertyName: property.name });
    }
  }

  @boundMethod
  private handleNeedValidate() {
    const { onNeedValidate, fieldValue, property } = this.props;

    if (onNeedValidate) {
      onNeedValidate({
        value: fieldValue,
        propertyName: property.name
      });
    }
  }
}
