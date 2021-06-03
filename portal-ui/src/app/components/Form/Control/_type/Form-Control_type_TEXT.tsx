import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@material-ui/core';

import { ValueType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeText extends Component<FormControlProps> {
  render() {
    const { htmlId, className } = this.props;

    return (
      <div className={cnFormControl(null, [className])}>
        <TextField id={htmlId} fullWidth multiline rowsMax={4} />
      </div>
    );
  }
}

export const withTypeText = withBemMod<{}, FormControlProps>(
  cnFormControl(),
  { type: ValueType.TEXT },
  () => FormControlTypeText
);
