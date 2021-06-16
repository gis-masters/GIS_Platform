import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Checkbox } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { ValueType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_CHECKBOX.scss';

@observer
class FormControlTypeCheckbox extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue } = this.props;

    return (
      <div className={cnFormControl(null, [className])}>
        <Checkbox
          checked={Boolean(fieldValue)}
          onChange={this.handleChange}
          inputProps={{ id: htmlId }}
          color='primary'
        />
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

export const withTypeCheckbox = withBemMod<{}, FormControlProps>(
  cnFormControl(),
  { type: ValueType.CHECKBOX },
  () => FormControlTypeCheckbox
);
