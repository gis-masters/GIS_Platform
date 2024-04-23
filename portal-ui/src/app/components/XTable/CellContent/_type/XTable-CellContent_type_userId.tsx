import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { CrgUser, MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { usersService } from '../../../../services/auth/users/users.service';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { Users } from '../../../Users/Users';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

@observer
class XTableCellContentTypeUserId extends Component<XTableCellContentProps<unknown>> {
  @observable private minimizedUser?: MinimizedCrgUser;
  private operationId?: symbol;

  constructor(props: XTableCellContentProps<unknown>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.fetchUser();
  }

  async componentDidUpdate(prevProps: XTableCellContentProps<unknown>) {
    if (this.props.cellData !== prevProps.cellData) {
      await this.fetchUser();
    }
  }

  render() {
    const { col, cellData, ...props } = this.props;

    return (
      <XTableCellContentBase col={col} {...props}>
        <Users value={this.minimizedUser ? [this.minimizedUser] : []} />
      </XTableCellContentBase>
    );
  }

  private async fetchUser() {
    const fieldValue = this.props.cellData as number | undefined;

    if (!fieldValue) {
      this.setMinimizedUser();

      return;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const user = await usersService.getUser(fieldValue);

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

export const withTypeUserId = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.USER_ID },
  () => XTableCellContentTypeUserId
);
