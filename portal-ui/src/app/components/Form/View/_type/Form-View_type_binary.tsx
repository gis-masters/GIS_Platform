import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

import '!style-loader!css-loader!sass-loader!./Form-View_type_binary.scss';

@observer
class FormViewTypeBinary extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, errors, inSet } = this.props;

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {fieldValue ? 'файл' : '—'}
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
