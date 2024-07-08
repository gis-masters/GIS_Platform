import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { CrgUser } from '../../../../services/auth/users/users.models';
import { usersService } from '../../../../services/auth/users/users.service';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { isNumberArray } from '../../../../services/util/typeGuards/isNumberArray';
import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentBase,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

@observer
class XTableFilterPanelItemContentUserId extends Component<XTableFilterPanelItemContentProps<unknown>> {
  @observable private minimizedUser?: string;
  private operationId?: symbol;

  constructor(props: XTableFilterPanelItemContentProps<unknown>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.fetchUser();
  }

  async componentDidUpdate(prevProps: XTableFilterPanelItemContentProps<unknown>) {
    if (this.props.filter !== prevProps.filter) {
      await this.fetchUser();
    }
  }

  render() {
    return <XTableFilterPanelItemContentBase {...this.props} value={this.minimizedUser} />;
  }

  private async fetchUser() {
    const { filter, col } = this.props;
    const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;

    if (!filterValue) {
      this.setUser();

      return;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const userIds = filterValue.$in;

    if (!isNumberArray(userIds)) {
      this.setUser();

      return;
    }

    const user = await usersService.getUser(userIds[0]);

    if (this.operationId === operationId) {
      this.setUser(user);
    }
  }

  @action
  private setUser(user?: CrgUser) {
    this.minimizedUser = user && `${user.surname || ''} ${user.name} ${user.middleName || ''}`;
  }
}

export const withTypeUserId = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: PropertyType.USER_ID }, () => XTableFilterPanelItemContentUserId);
