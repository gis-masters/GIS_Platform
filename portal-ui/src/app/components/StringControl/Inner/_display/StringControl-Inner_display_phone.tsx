import React, { type ChangeEvent, Component, type JSX } from 'react';
import { observer } from 'mobx-react';
import {
  type FilledTextFieldProps,
  type OutlinedTextFieldProps,
  type StandardTextFieldProps,
  TextField,
  type TextFieldVariants
} from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import InputMask from 'react-input-mask';

import { cnStringControlInner, type StringControlInnerProps } from '../StringControl-Inner.base';

@observer
class StringControlInnerDisplayPhone extends Component<StringControlInnerProps> {
  render() {
    const { fieldValue, errors, htmlId, property, variant, labelInField, inSet } = this.props;

    return (
      <InputMask
        mask='9 (999) 999 99 99'
        value={typeof fieldValue === 'string' ? fieldValue : ''}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        alwaysShowMask
      >
        {
          // @ts-expect-error беда в типах react-input-mask
          (
            inputProps: JSX.IntrinsicAttributes & { variant?: TextFieldVariants } & Omit<
                StandardTextFieldProps | OutlinedTextFieldProps | FilledTextFieldProps,
                'variant'
              >
          ) => (
            <TextField
              {...inputProps}
              id={htmlId}
              name={property.name}
              fullWidth={!inSet}
              error={!!errors?.length}
              helperText={errors}
              label={inSet || labelInField ? property.title : undefined}
              variant={variant}
            />
          )
        }
      </InputMask>
    );
  }

  @boundMethod
  private handleChange(event: ChangeEvent<{ value: string }>) {
    this.props.onChange(event.target.value);
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
