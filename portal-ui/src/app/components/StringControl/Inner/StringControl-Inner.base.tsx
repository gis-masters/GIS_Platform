import React, { Component } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaString, PropertySchemaText, PropertyType } from '../../../services/data/schema/schema.models';
import { FormControlProps } from '../../Form/Control/Form-Control';

export const cnStringControlInner = cn('StringControl', 'Inner');

export interface StringControlInnerProps extends Omit<FormControlProps, 'onChange'> {
  property: PropertySchemaString | PropertySchemaText;
  textFieldProps?: Partial<TextFieldProps>;
  display?: string;
  onBlur(): void;
  onChange(value: string): void;
}

export class StringControlInnerBase extends Component<StringControlInnerProps> {
  render() {
    const { htmlId, inSet, labelInField, fieldValue, errors, property, variant, textFieldProps, className, onBlur } =
      this.props;
    const { title, name } = property;

    return (
      <TextField
        id={htmlId}
        name={name}
        className={cnStringControlInner(null, [className])}
        fullWidth={labelInField || !inSet}
        value={fieldValue || ''}
        error={!!errors?.length}
        helperText={errors}
        multiline={property.propertyType === PropertyType.TEXT}
        label={labelInField || inSet ? title : undefined}
        onChange={this.handleChange}
        onBlur={onBlur}
        variant={variant}
        {...textFieldProps}
      />
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: string }>) {
    this.props.onChange(event.target.value);
  }
}
