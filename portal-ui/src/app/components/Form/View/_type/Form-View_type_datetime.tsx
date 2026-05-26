import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { type PropertySchemaDatetime, PropertyType } from '../../../../services/data/schema/schema.models';
import { formatDate } from '../../../../services/util/date.util';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
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
        <FormViewWarnings warnings={this.props.warnings} />
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
