import React, { type ChangeEvent, Component } from 'react';
import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { type PropertySchemaText } from '../../../services/data/schema/schema.models';
import { type FormControlProps } from '../../Form/Control/Form-Control';
import { FormErrors } from '../../Form/Errors/Form-Errors';
import { getFieldInputColor } from '../../Form/Form.utils';

export const cnTextControlInner = cn('TextControl', 'Inner');

export interface TextControlInnerProps extends Omit<FormControlProps, 'onChange'> {
  property: PropertySchemaText;
  onBlur(): void;
  onChange(value: string): void;
}

export class TextControlInnerBase extends Component<TextControlInnerProps> {
  render() {
    const { htmlId, inSet, labelInField, fieldValue, errors, warnings, property, variant, className, onBlur } =
      this.props;
    const { title, name } = property;

    return (
      <TextField
        id={htmlId}
        name={name}
        className={cnTextControlInner(null, [className])}
        fullWidth={labelInField || !inSet}
        value={fieldValue || ''}
        error={!!errors?.length}
        color={getFieldInputColor(errors, warnings)}
        helperText={<FormErrors errors={errors} warnings={warnings} inHelperText />}
        label={labelInField || inSet ? title : undefined}
        onChange={this.handleChange}
        onBlur={onBlur}
        variant={variant}
      />
    );
  }

  @boundMethod
  private handleChange(event: ChangeEvent<{ value: string }>) {
    this.props.onChange(event.target.value);
  }
}
