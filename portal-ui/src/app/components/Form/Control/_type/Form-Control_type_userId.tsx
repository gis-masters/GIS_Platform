import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { CrgUser, MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { usersService } from '../../../../services/auth/users/users.service';
import { PropertySchemaUser, PropertyType } from '../../../../services/data/schema/schema.models';
import { Users } from '../../../Users/Users';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeUserId extends Component<FormControlProps> {
  @observable private user?: MinimizedCrgUser;
  private operationId?: symbol;

  constructor(props: FormControlProps) {
    super(props);

    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchUser();
  }

  async componentDidUpdate(prevProps: FormControlProps) {
    if (prevProps.fieldValue !== this.props.fieldValue) {
      await this.fetchUser();
    }
  }

  render() {
    const { className, inSet, errors, fullWidthForOldForm, property } = this.props;
    const { onlySubordinates } = property as PropertySchemaUser;

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Users
          onlySubordinates={onlySubordinates}
          value={this.user ? [this.user] : []}
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

    if (onChange && property) {
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
  private setUser(user?: CrgUser | MinimizedCrgUser) {
    this.user = user && {
      id: user.id,
      name: user.name,
      surname: user.surname,
      middleName: user.middleName,
      email: user.email
    };
  }
}

export const withTypeUserId = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.USER_ID },
  () => FormControlTypeUserId
);
