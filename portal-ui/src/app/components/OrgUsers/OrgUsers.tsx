import React, { Component, ReactNode } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Done, Block } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { FilterParams } from '../../services/util/filterObjects';
import { permissionsListService } from '../../services/crg/permissionsList.service';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { CrgUser, usersService } from '../../services/crg/users.service';
import { PrincipalType } from '../../services/crg/permissions.service';
import { allPermissions } from '../../stores/AllPermissions.store';
import { allGroups } from '../../stores/AllGroups.store';
import { allUsers } from '../../stores/AllUsers.store';
import { OrgActions } from '../OrgActions/OrgActions';
import { Highlight } from '../Highlight/Highlight';
import { IdBadge } from '../IdBadge/IdBadge';
import { XTable } from '../XTable/XTable';

import { OrgUsersCreate } from './Create/OrgUsers-Create';

import '!style-loader!css-loader!sass-loader!./OrgUsers.scss';

const cnOrgUsers = cn('OrgUsers');

interface CrgUserExtended extends CrgUser {
  groups: CrgGroup[];
  groupsString: string;
  permissionsCount: number;
}

@observer
export class OrgUsers extends Component {
  componentDidMount() {
    usersService.initUsersListStore();
    groupsService.initGroupsListStore();
    permissionsListService.initGroupsListStore();
  }

  render() {
    return (
      <XTable
        className={cnOrgUsers()}
        headerActions={<OrgUsersCreate />}
        data={this.users}
        cols={[
          {
            title: 'Фамилия',
            field: 'surName',
            filtering: true,
            sorting: true
          },
          {
            title: 'Имя',
            field: 'name',
            filtering: true,
            sorting: true
          },
          {
            title: 'Активен',
            field: 'enabled',
            sorting: true,
            align: 'right',
            renderCellContent: this.renderUserEnabled
          },
          {
            title: 'e-mail / username',
            field: 'email',
            filtering: true,
            sorting: true,
            align: 'right',
            renderCellContent: this.renderUserEmail
          },
          {
            title: 'Группы',
            field: 'groupsString',
            filtering: true,
            align: 'right'
          },
          {
            title: 'Разрешений',
            field: 'permissionsCount',
            filtering: true,
            sorting: true,
            align: 'right'
          },
          {
            title: 'Действия',
            align: 'right',
            cellProps: { padding: 'checkbox' },
            renderCellContent: this.renderUserActions
          }
        ]}
        defaultSort={{ field: 'surName', asc: true }}
        secondarySortField='id'
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
        groupsString: groups.map(({ name }) => name).join(', '),
        permissionsCount: allPermissions.list.filter(item =>
          item.permissions.find(
            ({ principalId, principalType }) => Number(principalId) === user.id && principalType === PrincipalType.USER
          )
        ).length
      };
    });
  }

  @boundMethod
  private renderUserEnabled(user: CrgUserExtended) {
    return user.enabled ? <Done /> : <Block />;
  }

  @boundMethod
  private renderUserEmail(user: CrgUserExtended, filterActive: boolean, filterParams: FilterParams<CrgUserExtended>) {
    return (
      <>
        <Highlight word={filterParams.email} enabled={filterActive}>
          {user.email}
        </Highlight>
        {user.email !== user.username && ` / ${user.username}`}
        <IdBadge id={user.id} />
      </>
    );
  }

  @boundMethod
  private renderUserActions(user: CrgUserExtended): ReactNode {
    return <OrgActions user={user} userGroups={user.groups} />;
  }
}
