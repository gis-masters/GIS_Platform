import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { PropertyType, PropertySchemaChoice } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

const EMPTY = '~~~empty_value~~~';

@observer
class FormControlTypeChoice extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue = EMPTY, property, errors } = this.props;
    const { options } = property as PropertySchemaChoice;
    const valueIsAllowed = options.some(({ value }) => String(value) === String(fieldValue));
    const valueCanBeDisplayed =
      fieldValue !== EMPTY && (typeof fieldValue === 'number' || typeof fieldValue === 'string');

    return (
      <div className={cnFormControl(null, [className])}>
        {!!options && (
          <>
            <Select
              id={htmlId}
              fullWidth
              value={fieldValue}
              onChange={this.handleChange}
              error={!!errors?.length}
              variant='standard'
            >
              {!valueIsAllowed && (
                <MenuItem value={fieldValue as string | number} color='#666'>
                  <em>{valueCanBeDisplayed ? fieldValue : 'Не выбрано'}</em>
                </MenuItem>
              )}
              {options.map((item, i) => {
                return (
                  <MenuItem key={i} value={item.value}>
                    {item.title}
                  </MenuItem>
                );
              })}
            </Select>
            <FormErrors errors={errors} />
          </>
        )}
      </div>
    );
  }

  @boundMethod
  private handleChange(event: SelectChangeEvent<string | number>) {
    const { onChange, onNeedValidate, property } = this.props;

    if (onChange) {
      onChange({
        value: event.target.value,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value: event.target.value,
        propertyName: property.name
      });
    }
  }
}

export const withTypeChoice = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.CHOICE },
  () => FormControlTypeChoice
);
