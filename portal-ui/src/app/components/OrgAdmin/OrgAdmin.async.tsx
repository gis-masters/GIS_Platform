import React, { Component, SyntheticEvent } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tab, Tabs } from '@mui/material';
import { cn } from '@bem-react/classname';

import { allDataEntitiesService } from '../../services/data/vectorData/allVectorDataEntities.service';
import { allPermissionsService } from '../../services/permissions/allPermissions.service';
import { allGroups } from '../../stores/AllGroups.store';
import { allPermissions } from '../../stores/AllPermissions.store';
import { allUsers } from '../../stores/AllUsers.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { Loading } from '../Loading/Loading';
import { OrganizationClean } from '../OrganizationClean/OrganizationClean';
import { OrganizationInfo } from '../OrganizationInfo/OrganizationInfo';
import { OrganizationSettings } from '../OrganizationSettings/OrganizationSettings';
import { OrgGroups } from '../OrgGroups/OrgGroups';
import { OrgProjections } from '../OrgProjections/OrgProjections';
import { OrgUsers } from '../OrgUsers/OrgUsers';

import '!style-loader!css-loader!sass-loader!./OrgAdmin.scss';

const cnOrgAdmin = cn('OrgAdmin');

const tabs = [
  [OrgUsers, 'Пользователи'],
  [OrgGroups, 'Группы'],
  [OrganizationSettings, 'Настройки'],
  [OrgProjections, 'Системы координат'],
  [OrganizationClean, 'Очистка'],
  [OrganizationInfo, 'Информация']
];

@observer
export default class OrgAdmin extends Component {
  @observable private activeTab = 0;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (organizationSettings.showPermissions) {
      await allDataEntitiesService.initAllDataEntitiesStore();
      await allPermissionsService.initAllPermissionsStore();
    }
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
          onChange={this.handleChange}
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
  private handleChange(event: SyntheticEvent<Element, Event>, value: number) {
    this.activeTab = value;
  }
}
