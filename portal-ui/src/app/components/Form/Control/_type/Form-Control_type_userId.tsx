import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { CrgUser, MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { usersService } from '../../../../services/auth/users/users.service';
import { Users } from '../../../Users/Users';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

@observer
class FormControlTypeUserId extends Component<FormControlProps> {
  @observable private user?: MinimizedCrgUser;
  private operationId?: symbol;

  async componentDidMount() {
    await this.fetchUser();
  }

  async componentDidUpdate(prevProps: FormControlProps) {
    if (prevProps.fieldValue !== this.props.fieldValue) {
      await this.fetchUser();
    }
  }

  render() {
    const { className, inSet, errors, fullWidthForOldForm } = this.props;

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Users value={[this.user]} editable onChange={this.handleChange} />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: MinimizedCrgUser[]) {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: value[0]?.id ?? null,
        propertyName: property.name
      });
    }
  }

  private async fetchUser() {
    const fieldValue = this.props.fieldValue as number | undefined;

    if (!fieldValue) {
      this.setUser();

      return;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const user = await usersService.getUser(fieldValue);

    if (this.operationId === operationId) {
      this.setUser(user);
    }
  }

  @action
  private setUser(user?: CrgUser) {
    this.user = user && {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email
    };
  }
}

export const withTypeUserId = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.USER_ID },
  () => FormControlTypeUserId
);
