import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@mui/material';

import { FieldType, PropertySchemaString } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeString extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', inSet, property, errors } = this.props;
    const { display } = property as PropertySchemaString;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          id={htmlId}
          fullWidth={!inSet}
          value={fieldValue}
          error={!!errors?.length}
          helperText={errors}
          label={inSet ? property.title : undefined}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          multiline={display === 'multiline'}
          variant='standard'
        />
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
  { type: FieldType.STRING },
  () => FormControlTypeString
);
