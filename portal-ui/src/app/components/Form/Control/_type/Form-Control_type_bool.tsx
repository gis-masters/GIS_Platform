import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { generateRandomId } from '../../../../services/util/randomId';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_bool.scss';

@observer
class FormControlTypeBool extends Component<FormControlProps> {
  render() {
    const { htmlId = 'formField_' + generateRandomId(), className, fieldValue, inSet, property, errors } = this.props;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <Checkbox
          name={property.name}
          checked={Boolean(fieldValue)}
          onChange={this.handleChange}
          inputProps={{ id: htmlId }}
          color='primary'
        />
        {inSet && property.title && <label htmlFor={htmlId}>{property.title}</label>}
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { onChange, onNeedValidate, property, fieldValue } = this.props;
    let value: boolean | string | number = e.target.checked;

    if (typeof fieldValue === 'string') {
      value = value ? 'true' : '';
    }

    if (typeof fieldValue === 'number') {
      value = value ? 1 : 0;
    }

    if (onChange) {
      onChange({
        value,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value,
        propertyName: property.name
      });
    }
  }
}

export const withTypeBool = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.BOOL },
  () => FormControlTypeBool
);
