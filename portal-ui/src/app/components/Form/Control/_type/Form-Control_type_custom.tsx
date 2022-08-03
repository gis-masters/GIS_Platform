import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaCustom, PropertyType } from '../../../../services/data/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

@observer
class FormControlTypeCustom extends Component<FormControlProps> {
  render() {
    const { className, property, errors } = this.props;
    const { ControlComponent } = property as PropertySchemaCustom;

    return (
      <div className={cnFormControl(null, [className])}>
        <ControlComponent {...this.props} />
        <FormErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeCustom = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.CUSTOM },
  () => FormControlTypeCustom
);
