import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaDatetime, PropertyType } from '../../../../services/data/schema/schema.models';
import { formatDate } from '../../../../services/util/date.util';
import { FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeDatetime extends Component<FormControlProps> {
  render() {
    const { className, errors, inSet, fieldValue: fv, property } = this.props;
    const fieldValue = fv || '—';

    const date =
      typeof fieldValue === 'number' || typeof fieldValue === 'string' || fieldValue instanceof Date
        ? formatDate(fieldValue, (property as PropertySchemaDatetime).format)
        : '';

    return (
      <div className={cnFormView({ inSet, empty: fieldValue === '—', type: property.propertyType }, [className])}>
        {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
        <FormViewValue>{date}</FormViewValue>
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeDatetime = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.DATETIME },
  () => FormViewTypeDatetime
);
