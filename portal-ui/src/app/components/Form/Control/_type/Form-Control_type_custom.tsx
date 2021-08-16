import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaCustom, FieldType } from '../../../../services/crg/schemaNew.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeCustom extends Component<FormControlProps> {
  render() {
    const { className, property } = this.props;
    const { ControlComponent } = property as PropertySchemaCustom;

    return (
      <div className={cnFormControl(null, [className])}>
        <ControlComponent {...this.props} onChange={this.handleChange} />
      </div>
    );
  }

  @boundMethod
  private handleChange({ value }: { value: unknown; propertyName: string }) {
    const { onChange, property } = this.props;

    onChange({
      value,
      propertyName: property.name
    });
  }
}

export const withTypeCustom = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.CUSTOM },
  () => FormControlTypeCustom
);
