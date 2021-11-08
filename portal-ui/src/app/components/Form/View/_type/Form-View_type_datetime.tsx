import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import moment from 'moment';

import { PropertySchemaDatetime, PropertyType } from '../../../../services/crg/schema.models';

import { cnFormView } from '../Form-View';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';

@observer
class FormViewTypeDatetime extends Component<FormControlProps> {
  render() {
    const { className, errors, inSet, fieldValue = '—', property } = this.props;
    const { format = 'DD.MM.YYYY' } = property as PropertySchemaDatetime;
    const date = moment(fieldValue);

    return (
      <div className={cnFormView({ inSet, empty: fieldValue === '—', type: property.propertyType }, [className])}>
        {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
        <FormViewValue>{date.isValid() ? date.format(format) : fieldValue}</FormViewValue>
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
