import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { CrgUser, MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { usersService } from '../../../../services/auth/users/users.service';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { Users } from '../../../Users/Users';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeUserId extends Component<FormControlProps> {
  @observable private minimizedUser?: MinimizedCrgUser;
  private operationId?: symbol;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.fetchUser();
  }

  async componentDidUpdate(prevProps: FormControlProps) {
    if (prevProps.fieldValue !== this.props.fieldValue) {
      await this.fetchUser();
    }
  }

  render() {
    const { className, inSet, errors } = this.props;

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {this.minimizedUser ? <Users value={[this.minimizedUser]} /> : <FormViewValue>—</FormViewValue>}
        <FormViewErrors errors={errors} />
      </div>
    );
  }

  private async fetchUser() {
    if (!this.props.fieldValue) {
      this.setMinimizedUser();

      return;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const user = await usersService.getUser(Number(this.props.fieldValue));

    if (this.operationId === operationId) {
      this.setMinimizedUser(user);
    }
  }

  @action
  private setMinimizedUser(user?: CrgUser) {
    this.minimizedUser = user && {
      id: user.id,
      name: user.name,
      surname: user.surname,
      middleName: user.middleName,
      email: user.email
    };
  }
}

export const withTypeUserId = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.USER_ID },
  () => FormViewTypeUserId
);
