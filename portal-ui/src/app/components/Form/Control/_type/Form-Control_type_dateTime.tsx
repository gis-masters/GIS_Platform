import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import moment from 'moment';

import { PropertySchemaDatetime, PropertyType } from '../../../../services/data/schema/schema.models';
import { systemFormat } from '../../../../services/util/date.util';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeDatetime extends Component<FormControlProps> {
  render() {
    const {
      htmlId,
      className,
      fieldValue,
      inSet,
      property,
      errors,
      variant = 'standard',
      fullWidthForOldForm
    } = this.props;
    const { name } = property as PropertySchemaDatetime;
    const date = fieldValue ? moment(fieldValue) : undefined;

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <TextField
          type='date'
          id={htmlId}
          name={name}
          fullWidth={!inSet}
          value={date?.isValid?.() ? date.format(systemFormat) : ''}
          onChange={this.handleChange}
          label={inSet ? property.title : undefined}
          InputLabelProps={{
            shrink: true
          }}
          variant={variant}
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
        value: date || null,
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
