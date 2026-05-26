import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { type CrgUser } from '../../../../services/auth/users/users.models';
import { type PropertySchemaUser, PropertyType } from '../../../../services/data/schema/schema.models';
import { isArray } from '../../../../services/util/typeGuards/isArray';
import { Users } from '../../../Users/Users';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeUser extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue } = this.props;

    let value: CrgUser[];

    try {
      value = JSON.parse(String(fieldValue)) as CrgUser[];
      if (!isArray(value)) {
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
        <FormViewWarnings warnings={this.props.warnings} />
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
