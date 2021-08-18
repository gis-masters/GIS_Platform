import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Checkbox } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { FieldType } from '../../../../services/crg/schemaNew.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormError } from '../../Error/Form-Error';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_bool.scss';

@observer
class FormControlTypeBool extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue, inSet, error } = this.props;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <Checkbox
          checked={Boolean(fieldValue)}
          onChange={this.handleChange}
          inputProps={{ id: htmlId }}
          color='primary'
        />
        {error && <FormError>{error}</FormError>}
      </div>
    );
  }

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { onChange, property } = this.props;

    onChange({
      value: e.target.checked,
      propertyName: property.name
    });
  }
}

export const withTypeBool = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.BOOL },
  () => FormControlTypeBool
);
