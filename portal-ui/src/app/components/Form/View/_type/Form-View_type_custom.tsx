import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { type PropertySchemaCustom, PropertyType } from '../../../../services/data/schema/schema.models';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeCustom extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, errors, labelInField, property } = this.props;
    const { ViewComponent } = property as PropertySchemaCustom;

    return (
      <div className={cnFormView({ labelInField }, [className])}>
        {ViewComponent ? <ViewComponent {...this.props} /> : String(fieldValue)}
        <FormViewWarnings warnings={this.props.warnings} />
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeCustom = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.CUSTOM },
  () => FormViewTypeCustom
);
