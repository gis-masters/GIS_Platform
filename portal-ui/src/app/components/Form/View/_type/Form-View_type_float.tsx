import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaFloat, PropertyType } from '../../../../services/data/schema/schema.models';
import { FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeFloat extends Component<FormControlProps> {
  render() {
    const { className, errors, fullWidthForOldForm, inSet, property } = this.props;
    let { fieldValue = '—' } = this.props;
    const { precision } = property as PropertySchemaFloat;

    if (typeof precision === 'number' && !Number.isNaN(Number(fieldValue))) {
      fieldValue = String(Number(Number(fieldValue).toFixed(precision)));
    }

    return (
      <div
        className={cnFormView({ inSet, fullWidthForOldForm, empty: fieldValue === '—', type: property.propertyType }, [
          className
        ])}
      >
        {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
        <FormViewValue>{String(fieldValue)}</FormViewValue>
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeFloat = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.FLOAT },
  () => FormViewTypeFloat
);
