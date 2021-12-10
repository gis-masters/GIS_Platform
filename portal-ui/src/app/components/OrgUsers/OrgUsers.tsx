import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { allUsers } from '../../stores/AllUsers.store';
import { allGroups } from '../../stores/AllGroups.store';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { CrgUser, usersService } from '../../services/crg/users.service';
import { XTable, XTableColumn } from '../XTable/XTable';

import { OrgUsersCreate } from './Create/OrgUsers-Create';
import { OrgUsersEnabled } from './Enabled/OrgUsers-Enabled';
import { OrgUsersUserEmail } from './UserEmail/OrgUsers-UserEmail';
import { OrgUsersUserActions } from './UserActions/OrgUsers-UserActions';
import { OrgUsersPermissionsCount } from './PermissionsCount/OrgUsers-PermissionsCount';

import '!style-loader!css-loader!sass-loader!./OrgUsers.scss';

const cnOrgUsers = cn('OrgUsers');

export interface CrgUserExtended extends CrgUser {
  groups: CrgGroup[];
  groupsString: string;
}

@observer
export class OrgUsers extends Component {
  private xTableCols: XTableColumn<CrgUserExtended>[] = [
    {
      title: 'Фамилия',
      field: 'surname',
      filterable: true,
      sortable: true
    },
    {
      title: 'Имя',
      field: 'name',
      filterable: true,
      sortable: true
    },
    {
      title: 'Активен',
      field: 'enabled',
      sortable: true,
      align: 'right',
      CellContent: OrgUsersEnabled
    },
    {
      title: 'e-mail / login',
      field: 'email',
      filterable: true,
      sortable: true,
      align: 'right',
      CellContent: OrgUsersUserEmail
    },
    {
      title: 'Группы',
      field: 'groupsString',
      filterable: true,
      align: 'right'
    },
    {
      title: 'Разрешений',
      CellContent: OrgUsersPermissionsCount,
      align: 'right'
    },
    {
      title: 'Действия',
      align: 'right',
      cellProps: { padding: 'checkbox' },
      CellContent: OrgUsersUserActions
    }
  ];

  async componentDidMount() {
    await Promise.all([await usersService.initUsersListStore(), await groupsService.initAllGroupsStore()]);
  }

  render() {
    return (
      <XTable
        className={cnOrgUsers()}
        headerActions={<OrgUsersCreate />}
        data={this.users}
        cols={this.xTableCols}
        defaultSort={{ field: 'surname', asc: true }}
        secondarySortField='id'
        getRowId={this.getUserId}
        filterable
      />
    );
  }

  @computed
  private get users(): CrgUserExtended[] {
    return allUsers.list.map(user => {
      const groups = allGroups.list.filter(group => group.users.some(({ id }) => id === user.id));

      return {
        ...user,
        groups,
        groupsString: groups.map(({ name }) => name).join(', ')
      };
    });
  }

  private getUserId(user: CrgUserExtended): number {
    return user.id;
  }
}
