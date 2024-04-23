import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { PropertySchemaUser, PropertyType } from '../../../../services/data/schema/schema.models';
import { Users } from '../../../Users/Users';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeUser extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue, fullWidthForOldForm } = this.props;

    let value: MinimizedCrgUser[];

    try {
      value = JSON.parse(String(fieldValue)) as MinimizedCrgUser[];
      if (!Array.isArray(value)) {
        value = [];
      }
    } catch {
      value = [];
    }

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Users
          value={value}
          multiple={(property as PropertySchemaUser).multiple}
          editable
          onChange={this.handleChange}
        />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: MinimizedCrgUser[]) {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: JSON.stringify(value),
        propertyName: property.name
      });
    }
  }
}

export const withTypeUser = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.USER },
  () => FormControlTypeUser
);
