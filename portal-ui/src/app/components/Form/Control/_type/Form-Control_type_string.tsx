import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@mui/material';
import InputMask from 'react-input-mask';

import { PropertyType, PropertySchemaString } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_string.scss';

@observer
class FormControlTypeString extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue, inSet, property, errors, variant = 'standard' } = this.props;
    const { display, name } = property as PropertySchemaString;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
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
            fullWidth={!inSet}
            value={fieldValue || ''}
            error={!!errors?.length}
            helperText={errors}
            label={inSet ? property.title : undefined}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            inputProps={{ className: 'scroll' }}
            multiline={display === 'multiline' || display === 'code'}
            type={display === 'password' ? 'password' : undefined}
            minRows={2}
            maxRows={10}
            variant={variant}
          />
        )}
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: string }>) {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: event.target.value,
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
}

export const withTypeString = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.STRING },
  () => FormControlTypeString
);
