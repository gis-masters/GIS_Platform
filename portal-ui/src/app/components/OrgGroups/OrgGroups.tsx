import React, { Component, ReactNode } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allGroups } from '../../stores/AllGroups.store';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { PrincipalType } from '../../services/crg/permissions.models';
import { OrgActions } from '../OrgActions/OrgActions';
import { XTable, XTableColumn } from '../XTable/XTable';
import { PermissionsCount } from '../PermissionsCount/PermissionsCount';

import { OrgGroupsCreate } from './Create/OrgGroups-Create';

import '!style-loader!css-loader!sass-loader!./OrgGroups.scss';

const cnOrgGroups = cn('OrgGroups');

interface CrgGroupExtended extends CrgGroup {
  usersCount: number;
}

@observer
export class OrgGroups extends Component {
  private xTableCols: XTableColumn<CrgGroupExtended>[] = [
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
      renderCellContent: this.renderPermissionsCount,
      align: 'right'
    },
    {
      title: 'Действия',
      align: 'right',
      cellProps: { padding: 'checkbox' },
      renderCellContent: this.renderGroupActions
    }
  ];

  async componentDidMount() {
    await groupsService.initAllGroupsStore();
  }

  render() {
    return (
      <XTable
        className={cnOrgGroups()}
        headerActions={<OrgGroupsCreate />}
        data={this.groups}
        cols={this.xTableCols}
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
      usersCount: group.users.length
    }));
  }

  @boundMethod
  private renderPermissionsCount(rowData: CrgGroupExtended): ReactNode {
    return <PermissionsCount principalId={rowData.id} principalType={PrincipalType.GROUP} />;
  }

  @boundMethod
  private renderGroupActions(group: CrgGroupExtended): ReactNode {
    return <OrgActions group={group} />;
  }
}
