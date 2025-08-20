import React, { Component } from 'react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { FiasValue } from '../../../../services/data/fias/fias.models';
import { PropertySchemaFias, PropertyType } from '../../../../services/data/schema/schema.models';
import { Fias } from '../../../Fias/Fias';
import { cnFormControl, FormControlProps } from '../Form-Control';

class FormControlTypeFias extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = {}, inSet, fullWidthForOldForm, errors, property, variant } = this.props;
    const { name, searchMode } = property as PropertySchemaFias;
    const value = (fieldValue as FiasValue) || undefined;

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Fias
          htmlId={htmlId}
          value={value}
          name={name}
          searchMode={searchMode}
          fullWidth={fullWidthForOldForm}
          variant={variant}
          errors={errors}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: FiasValue) {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value,
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

export const withTypeFias = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FIAS },
  () => FormControlTypeFias
);
