import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { FiasValue } from '../../../../services/data/fias/fias.models';
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
        <FiasView value={fieldValue as FiasValue} />
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
