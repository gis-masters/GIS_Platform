import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { CrgUser } from '../../../../services/auth/users/users.models';
import { PropertySchemaUser, PropertyType } from '../../../../services/data/schema/schema.models';
import { Users } from '../../../Users/Users';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeUser extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue } = this.props;

    let value: CrgUser[];

    try {
      value = JSON.parse(String(fieldValue)) as CrgUser[];
      if (!Array.isArray(value)) {
        value = [];
      }
    } catch {
      value = [];
    }

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {value.length ? (
          <Users value={value} multiple={(property as PropertySchemaUser).multiple} />
        ) : (
          <FormViewValue>—</FormViewValue>
        )}
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeUser = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.USER },
  () => FormViewTypeUser
);
