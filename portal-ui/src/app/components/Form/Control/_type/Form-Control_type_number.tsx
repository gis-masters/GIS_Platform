import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputAdornment, Slider, TextField } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaNumber } from '../../../../services/data/schema/schema.models';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_number.scss';

@observer
export class FormControlTypeNumber extends Component<FormControlProps> {
  render() {
    const {
      htmlId,
      className,
      fieldValue,
      property,
      inSet,
      errors,
      variant = 'standard',
      fullWidthForOldForm
    } = this.props;
    const { measureUnit, title, minValue, maxValue, step, display = 'number', name } = property as PropertySchemaNumber;

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm, type: 'number', display }, [className])}>
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
    let targetValue = event.target.value;
    targetValue = targetValue.replaceAll(',', '.');

    if (
      targetValue &&
      (!Number.isNaN(targetValue) || targetValue === '' || targetValue === '-' || targetValue === '.')
    ) {
      this.change(targetValue ? Number(targetValue) : undefined);
    }
  }

  @boundMethod
  private handleSliderChange(event: Event, value: number | number[]) {
    if (Array.isArray(value)) {
      throw new TypeError('Множественный режим слайдера не поддерживается');
    }
    this.change(value);
    this.handleNeedValidate();
  }

  private change(value: number | string | undefined) {
    const { onChange, property } = this.props;

    const { maxValue } = property as PropertySchemaNumber;

    if (
      typeof maxValue === 'number' &&
      (typeof value === 'number' || (typeof value === 'string' && !Number.isNaN(Number(value)))) &&
      Number(value) > maxValue
    ) {
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
