import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaFloat, PropertyType } from '../../../../services/data/schema/schema.models';
import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormControlTypeNumber } from './Form-Control_type_number';

@observer
export class FormControlTypeFloat extends Component<FormControlProps> {
  render() {
    return <FormControlTypeNumber {...this.props} onChange={this.handleChange} />;
  }

  @boundMethod
  private handleChange({ value, propertyName }: { value: number; propertyName: string }) {
    const { onChange, property } = this.props;
    const { precision } = property as PropertySchemaFloat;

    if (value && typeof precision === 'number') {
      value = Number(Number(value).toFixed(precision));
    }

    if (onChange) {
      onChange({ value, propertyName });
    }
  }
}

export const withTypeFloat = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FLOAT },
  () => FormControlTypeFloat
);
