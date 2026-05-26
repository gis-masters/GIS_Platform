import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
import { cnFormView } from '../Form-View.base';

import './Form-View_type_binary.scss';

@observer
class FormViewTypeBinary extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, errors, inSet } = this.props;

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {fieldValue ? 'файл' : '—'}
        <FormViewWarnings warnings={this.props.warnings} />
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeBinary = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.BINARY },
  () => FormViewTypeBinary
);
