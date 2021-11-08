import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { TextField } from '@mui/material';

import { PropertyType, PropertySchemaDatetime } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

@observer
class FormControlTypeDatetime extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', inSet, property, errors } = this.props;
    const { defaultValue } = property as PropertySchemaDatetime;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          type='date'
          id={htmlId}
          fullWidth={!inSet}
          value={fieldValue ? (fieldValue as string) : defaultValue || ''}
          onChange={this.handleChange}
          label={inSet ? property.title : undefined}
          InputLabelProps={{
            shrink: true
          }}
          variant='standard'
        />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { onChange, property, onNeedValidate } = this.props;
    const date = e.target.value;

    if (onChange) {
      onChange({
        value: date,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value: date,
        propertyName: property.name
      });
    }
  }
}

export const withTypeDatetime = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.DATETIME },
  () => FormControlTypeDatetime
);
