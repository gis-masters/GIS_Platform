import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { FiasValue } from '../../../../services/data/fias/fias.models';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { FiasView } from '../../../FiasView/FiasView';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

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
