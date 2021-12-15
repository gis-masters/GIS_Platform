import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/crg/schema.models';

import { cnFormView } from '../Form-View';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { Fias } from '../../../../services/fias.service';

@observer
class FormViewTypeFias extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, errors } = this.props;
    const fiasValue = fieldValue as Fias;

    return (
      <div className={cnFormView(null, [className])}>
        {fiasValue.fullAddress} {fiasValue.oktmo ? `ОКТМО: ${fiasValue.oktmo}` : ''}{' '}
        {fiasValue.objectId ? `Код фиас: ${fiasValue.objectId}` : ''}
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeFias = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.FIAS },
  () => FormViewTypeFias
);
