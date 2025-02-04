import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { CrgGroup } from '../../services/auth/groups/groups.models';
import { groupsService } from '../../services/auth/groups/groups.service';
import { CrgUser } from '../../services/auth/users/users.models';
import { usersService } from '../../services/auth/users/users.service';
import { PropertyType } from '../../services/data/schema/schema.models';
import { allGroups } from '../../stores/AllGroups.store';
import { allUsers } from '../../stores/AllUsers.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { XTable } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { OrgUsersCreate } from './Create/OrgUsers-Create';
import { OrgUsersEnabled } from './Enabled/OrgUsers-Enabled';
import { OrgUsersInvite } from './Invite/OrgUsers-Invite';
import { OrgUsersPermissionsCount } from './PermissionsCount/OrgUsers-PermissionsCount';
import { OrgUsersUserActions } from './UserActions/OrgUsers-UserActions';
import { OrgUsersUserEmail } from './UserEmail/OrgUsers-UserEmail';

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
      title: 'Отчество',
      field: 'middleName',
      filterable: true,
      sortable: true
    },
    {
      title: 'Должность',
      field: 'job',
      filterable: true,
      sortable: true
    },
    {
      title: 'Организация',
      field: 'department',
      filterable: true,
      sortable: true
    },
    {
      title: 'Начальник',
      field: 'bossId',
      filterable: true,
      sortable: true,
      type: PropertyType.USER_ID
    },
    {
      title: 'Контактный номер телефона',
      field: 'phone',
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
      title: 'Действия',
      align: 'right',
      cellProps: { padding: 'checkbox' },
      CellContent: OrgUsersUserActions
    }
  ];

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);

    if (organizationSettings.showPermissions) {
      this.xTableCols.splice(-1, 0, {
        title: 'Разрешений',
        CellContent: OrgUsersPermissionsCount,
        align: 'right'
      });
    }
  }

  async componentDidMount() {
    await Promise.all([usersService.initUsersListStore(), groupsService.initAllGroupsStore()]);
  }

  render() {
    return (
      <XTable
        className={cnOrgUsers()}
        headerActions={
          <>
            <OrgUsersInvite />
            <OrgUsersCreate />
          </>
        }
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
