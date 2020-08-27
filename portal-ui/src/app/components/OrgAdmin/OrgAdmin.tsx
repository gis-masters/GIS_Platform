import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs, Tab } from '@material-ui/core';

import { permissionsList } from '../../stores/PermissionsList.store';
import { groupsList } from '../../stores/GroupsList.store';
import { usersList } from '../../stores/UsersList.store';
import { OrgGroups } from '../OrgGroups/OrgGroups';
import { OrgUsers } from '../OrgUsers/OrgUsers';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./OrgAdmin.scss';

const cnOrgAdmin = cn('OrgAdmin');

const tabs = [
  [OrgUsers, 'Пользователи'],
  [OrgGroups, 'Группы']
];

@observer
export class OrgAdmin extends Component {
  @observable private activeTab = 0;

  render() {
    const [ChildComponent] = tabs[this.activeTab];

    return (
      <div className={cnOrgAdmin()}>
        <Tabs
          value={this.activeTab}
          indicatorColor='primary'
          textColor='primary'
          onChange={this.changeHandler}
          className={cnOrgAdmin('Tabs')}
        >
          {tabs.map(([, label], i) => (
            <Tab label={label} value={i} key={i} />
          ))}
        </Tabs>
        <ChildComponent />
        <Loading global visible={this.loading} value={permissionsList.fetchingProgress} />
      </div>
    );
  }

  @computed
  private get loading(): boolean {
    return usersList.fetching || groupsList.fetching || permissionsList.fetching;
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent, value: number) {
    this.activeTab = value;
  }
}
