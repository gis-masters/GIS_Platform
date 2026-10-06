import React, { type ChangeEvent, Component } from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { FormErrors } from '../../../Form/Errors/Form-Errors';
import { getFieldInputColor } from '../../../Form/Form.utils';
import { cnStringControlInner, type StringControlInnerProps } from '../StringControl-Inner.base';

const PHONE_MASK = '_ (___) ___ __ __';
const PHONE_DIGIT_COUNT = 11;

function toPhoneDigits(value: string): string {
  return value.replaceAll(/\D/g, '').slice(0, PHONE_DIGIT_COUNT);
}

function formatPhone(value: string): string {
  const digits = toPhoneDigits(value);
  let digitIndex = 0;

  return PHONE_MASK.replaceAll('_', () => digits[digitIndex++] ?? '_');
}

function applyPhoneInputChange(previousFormatted: string, nextInput: string, selectionStart: number): string {
  const previousDigits = toPhoneDigits(previousFormatted);
  const nextDigits = toPhoneDigits(nextInput);
  const deletedFormattingChar =
    nextInput.length < previousFormatted.length && nextDigits.length === previousDigits.length;

  if (deletedFormattingChar && previousDigits.length > 0 && selectionStart >= nextInput.length) {
    return formatPhone(previousDigits.slice(0, -1));
  }

  return formatPhone(nextInput);
}

@observer
class StringControlInnerDisplayPhone extends Component<StringControlInnerProps> {
  render() {
    const { fieldValue, errors, warnings, htmlId, property, variant, labelInField, inSet } = this.props;

    return (
      <TextField
        value={formatPhone(typeof fieldValue === 'string' ? fieldValue : '')}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        id={htmlId}
        name={property.name}
        fullWidth={!inSet}
        error={!!errors?.length}
        color={getFieldInputColor(errors, warnings)}
        helperText={<FormErrors errors={errors} warnings={warnings} inHelperText />}
        label={inSet || labelInField ? property.title : undefined}
        variant={variant}
      />
    );
  }

  @boundMethod
  private handleChange(event: ChangeEvent<HTMLInputElement>) {
    const previousFormatted = formatPhone(typeof this.props.fieldValue === 'string' ? this.props.fieldValue : '');
    const selectionStart = event.target.selectionStart ?? event.target.value.length;

    this.props.onChange(applyPhoneInputChange(previousFormatted, event.target.value, selectionStart));
  }

  @boundMethod
  private handleBlur() {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur();
    }
  }
}

export const withDisplayPhone = withBemMod<StringControlInnerProps>(
  cnStringControlInner(),
  { display: 'phone' },
  () => StringControlInnerDisplayPhone
);
