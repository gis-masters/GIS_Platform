import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaCustom, ValueType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_CHECKBOX.scss';

@observer
class FormControlTypeCustom extends Component<FormControlProps> {
  render() {
    const { className, property } = this.props;
    const { Component } = property as PropertySchemaCustom;

    return (
      <div className={cnFormControl(null, [className])}>
        <Component {...this.props} onChange={this.handleChange} />
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
  { type: ValueType.CUSTOM },
  () => FormControlTypeCustom
);
