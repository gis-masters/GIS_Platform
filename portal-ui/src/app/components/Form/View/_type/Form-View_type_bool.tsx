import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Check, Close } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

import '!style-loader!css-loader!sass-loader!./Form-View_type_bool.scss';

@observer
class FormViewTypeBool extends Component<FormControlProps> {
  render() {
    const { className, fieldValue, errors, inSet, property } = this.props;

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {fieldValue ? <Check color='primary' fontSize='small' /> : <Close color='disabled' fontSize='small' />}
        {inSet && <FormSetLabel>{property.title}</FormSetLabel>}
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeBool = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.BOOL },
  () => FormViewTypeBool
);
