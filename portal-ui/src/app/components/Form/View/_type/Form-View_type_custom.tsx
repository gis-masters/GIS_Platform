import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaCustom, PropertyType } from '../../../../services/data/schema/schema.models';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeCustom extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, errors, labelInField, property } = this.props;
    const { ViewComponent } = property as PropertySchemaCustom;

    return (
      <div className={cnFormView({ labelInField }, [className])}>
        {ViewComponent ? <ViewComponent {...this.props} /> : String(fieldValue)}
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
