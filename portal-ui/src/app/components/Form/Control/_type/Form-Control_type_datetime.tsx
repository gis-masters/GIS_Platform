import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { TextField } from '@material-ui/core';

import { FieldType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeDatetime extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', inSet, property } = this.props;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          type='date'
          id={htmlId}
          fullWidth={!inSet}
          value={fieldValue}
          label={inSet ? property.title : undefined}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: string }>) {
    const { onChange, property } = this.props;

    onChange({
      value: event.target.value,
      propertyName: property.name
    });
  }
}

export const withTypeDatetime = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.DATETIME },
  () => FormControlTypeDatetime
);
