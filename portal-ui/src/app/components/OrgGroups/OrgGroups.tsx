import React, { Component, ReactNode } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allGroups } from '../../stores/AllGroups.store';
import { allPermissions } from '../../stores/AllPermissions.store';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { PrincipalType } from '../../services/crg/permissions.service';
import { allPermissionsService } from '../../services/crg/allPermissions.service';
import { OrgActions } from '../OrgActions/OrgActions';
import { XTable } from '../XTable/XTable';

import { OrgGroupsCreate } from './Create/OrgGroups-Create';

import '!style-loader!css-loader!sass-loader!./OrgGroups.scss';

const cnOrgGroups = cn('OrgGroups');

interface CrgGroupExtended extends CrgGroup {
  usersCount: number;
  permissionsCount: number;
}

@observer
export class OrgGroups extends Component {
  async componentDidMount() {
    await groupsService.initGroupsListStore();
  }

  render() {
    return (
      <XTable
        className={cnOrgGroups()}
        headerActions={<OrgGroupsCreate />}
        data={this.groups}
        cols={[
          {
            title: 'Название',
            field: 'name',
            filtering: true,
            sorting: true,
            getIdBadge: ({ id }) => id
          },
          {
            title: 'Описание',
            field: 'description',
            filtering: true,
            sorting: true,
            align: 'right'
          },
          {
            title: 'Пользователей',
            field: 'usersCount',
            filtering: true,
            sorting: true,
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
            renderCellContent: this.renderGroupActions
          }
        ]}
        defaultSort={{ field: 'name', asc: true }}
        secondarySortField='id'
        filterable
      />
    );
  }

  @computed
  private get groups(): CrgGroupExtended[] {
    return allGroups.list.map(group => ({
      ...group,
      usersCount: group.users.length,
      permissionsCount: allPermissions.list.filter(item =>
        item.permissions.find(
          ({ principalId, principalType }) => Number(principalId) === group.id && principalType === PrincipalType.GROUP
        )
      ).length
    }));
  }

  @boundMethod
  private renderGroupActions(group: CrgGroupExtended): ReactNode {
    return <OrgActions group={group} />;
  }
}
