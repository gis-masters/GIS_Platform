import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { InputAdornment, TextField } from '@material-ui/core';

import { ValueType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeInt extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = '', property, inSet } = this.props;

    return (
      <div className={cnFormControl({ inSet }, [className])}>
        <TextField
          id={htmlId}
          fullWidth={!inSet}
          type='number'
          InputProps={{
            endAdornment: property.measureUnit ? (
              <InputAdornment position='end'>{property.measureUnit}</InputAdornment>
            ) : undefined
          }}
          value={fieldValue}
          label={inSet ? property.title : undefined}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    const { onChange, property } = this.props;
    let value = Number(event.target.value || 0);

    if (typeof property.maxInclusive === 'number' && value > property.maxInclusive) {
      value = property.maxInclusive;
    }

    if (typeof property.minInclusive === 'number' && value < property.minInclusive) {
      value = property.minInclusive;
    }

    onChange({
      value,
      propertyName: property.name
    });
  }
}

export const withTypeInt = withBemMod<{}, FormControlProps>(
  cnFormControl(),
  { type: ValueType.INT },
  () => FormControlTypeInt
);
