import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import InputMask from 'react-input-mask';

import { StringControlInnerProps, cnStringControlInner } from '../StringControl-Inner.base';
import { boundMethod } from 'autobind-decorator';
import {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants
} from '@mui/material';

@observer
class StringControlInnerDisplayPhone extends Component<StringControlInnerProps> {
  render() {
    const { fieldValue, errors, htmlId, property, variant, inSet } = this.props;

    return (
      <InputMask
        mask='9 (999) 999 99 99'
        value={fieldValue ? String(fieldValue) : ''}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      >
        {
          // @ts-expect-error беда в типах react-input-mask
          (
            inputProps: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
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
              label={inSet ? property.title : undefined}
              variant={variant}
            />
          )
        }
      </InputMask>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: string }>) {
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
