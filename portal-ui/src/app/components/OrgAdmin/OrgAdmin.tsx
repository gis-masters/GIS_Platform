import React, { Component } from 'react';
import { observable, action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs, Tab } from '@mui/material';
import { cn } from '@bem-react/classname';

import { allUsers } from '../../stores/AllUsers.store';
import { allGroups } from '../../stores/AllGroups.store';
import { allPermissions } from '../../stores/AllPermissions.store';
import { allDataEntitiesService } from '../../services/data/allDataEntities.service';
import { allPermissionsService } from '../../services/data/allPermissions.service';
import { OrganizationSettings } from '../OrganizationSettings/OrganizationSettings';
import { OrganizationClean } from '../OrganizationClean/OrganizationClean';
import { OrgGroups } from '../OrgGroups/OrgGroups';
import { OrgUsers } from '../OrgUsers/OrgUsers';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./OrgAdmin.scss';

const cnOrgAdmin = cn('OrgAdmin');

const tabs = [
  [OrgUsers, 'Пользователи'],
  [OrgGroups, 'Группы'],
  [OrganizationSettings, 'Настройки организации'],
  [OrganizationClean, 'Очистка']
];

@observer
export class OrgAdmin extends Component {
  @observable private activeTab = 0;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await allDataEntitiesService.initAllDataEntitiesStore();
    await allPermissionsService.initAllPermissionsStore();
  }

  componentWillUnmount() {
    allDataEntitiesService.dropAllDataEntitiesStore();
    allPermissionsService.dropPermissionsListStore();
  }

  render() {
    const [ChildComponent] = tabs[this.activeTab];

    return (
      <div className={cnOrgAdmin()}>
        <Tabs
          className={cnOrgAdmin('Tabs')}
          value={this.activeTab}
          indicatorColor='primary'
          textColor='primary'
          onChange={this.changeHandler}
        >
          {tabs.map(([, label], i) => (
            <Tab label={label as string} value={i} key={i} />
          ))}
        </Tabs>
        <ChildComponent />
        <Loading global visible={this.loading} />
      </div>
    );
  }

  @computed
  private get loading(): boolean {
    return allUsers.fetching || allGroups.fetching || allPermissions.fetching;
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent, value: number) {
    this.activeTab = value;
  }
}
