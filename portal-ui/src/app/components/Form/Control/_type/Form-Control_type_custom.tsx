import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { type PropertySchemaCustom, PropertyType } from '../../../../services/data/schema/schema.models';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, type FormControlProps } from '../Form-Control';

@observer
class FormControlTypeCustom extends Component<FormControlProps> {
  render() {
    const { className, property, labelInField, errors, warnings } = this.props;
    const { ControlComponent } = property as PropertySchemaCustom;

    return (
      <div className={cnFormControl({ labelInField }, [className])}>
        <ControlComponent {...this.props} />
        <FormErrors warnings={warnings} errors={errors} />
      </div>
    );
  }
}

export const withTypeCustom = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.CUSTOM },
  () => FormControlTypeCustom
);
