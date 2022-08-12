import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { makeObservable, observable } from 'mobx';
import InputMask from 'react-input-mask';

import { PropertyType, PropertySchemaString } from '../../../../services/data/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_string.scss';

@observer
class FormControlTypeString extends Component<FormControlProps> {
  @observable private showPassword = false;

  constructor(props: FormControlProps) {
    super(props);

    makeObservable(this);
  }

  render() {
    const {
      htmlId,
      className,
      fieldValue,
      inSet,
      property,
      errors,
      variant = 'standard',
      labelInTextField
    } = this.props;
    const { display, name } = property as PropertySchemaString;

    return (
      <div className={cnFormControl({ inSet, labelInTextField }, [className])}>
        {display === 'phone' ? (
          <InputMask
            mask='9 (999) 999 99 99'
            value={fieldValue || ''}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          >
            {inputProps => (
              <TextField
                {...inputProps}
                id={htmlId}
                name={name}
                fullWidth={!inSet}
                error={!!errors?.length}
                helperText={errors}
                label={inSet ? property.title : undefined}
                variant={variant}
              />
            )}
          </InputMask>
        ) : (
          <TextField
            id={htmlId}
            name={name}
            fullWidth={labelInTextField || !inSet}
            value={fieldValue || ''}
            error={!!errors?.length}
            helperText={errors}
            label={labelInTextField || inSet ? property.title : undefined}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            inputProps={{ className: 'scroll' }}
            multiline={display === 'multiline' || display === 'code'}
            type={this.type}
            minRows={2}
            maxRows={10}
            variant={variant}
            InputProps={{
              endAdornment: display === 'password' && (
                <InputAdornment position='end'>
                  <IconButton aria-label='Показать пароль' onClick={this.onShowPassword} edge='end'>
                    {this.showPassword ? <Visibility fontSize='small' /> : <VisibilityOff fontSize='small' />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )}
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: string }>) {
    const { onChange, property } = this.props;
    const { display } = property as PropertySchemaString;

    if (onChange) {
      onChange({
        value: display === 'email' ? event.target.value.trim() : event.target.value,
        propertyName: property.name
      });
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

  @boundMethod
  private onShowPassword() {
    this.showPassword = !this.showPassword;
  }

  private get type() {
    const { display } = this.props.property as PropertySchemaString;

    if (this.showPassword && display === 'password') {
      return 'text';
    }

    if (display === 'email') {
      return 'email';
    }

    return display === 'password' ? 'password' : undefined;
  }
}

export const withTypeString = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.STRING },
  () => FormControlTypeString
);
