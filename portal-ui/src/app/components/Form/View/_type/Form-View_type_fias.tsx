import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';
import { Fias } from '../../../../services/data/fias.service';
import { FiasView } from '../../../FiasView/FiasView';

import { cnFormView } from '../Form-View';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';

@observer
class FormViewTypeFias extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, inSet, errors } = this.props;

    return (
      <div className={cnFormView({ inSet }, [className])}>
        <FiasView value={fieldValue as Fias} />
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
