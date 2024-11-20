import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { CrgGroup } from '../../services/auth/groups/groups.models';
import { groupsService } from '../../services/auth/groups/groups.service';
import { PropertyType } from '../../services/data/schema/schema.models';
import { allGroups } from '../../stores/AllGroups.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { XTable } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { OrgGroupsCreate } from './Create/OrgGroups-Create';
import { OrgGroupsGroupActions } from './GroupActions/OrgGroups-GroupActions';
import { OrgGroupsPermissionsCount } from './PermissionsCount/OrgGroups-PermissionsCount';

import '!style-loader!css-loader!sass-loader!./OrgGroups.scss';

const cnOrgGroups = cn('OrgGroups');

export interface CrgGroupExtended extends CrgGroup {
  usersCount: number;
}

@observer
export class OrgGroups extends Component {
  private xTableCols: XTableColumn<CrgGroupExtended>[] = [
    {
      title: 'Название',
      field: 'name',
      filterable: true,
      sortable: true,
      getIdBadge: ({ id }) => id
    },
    {
      title: 'Описание',
      field: 'description',
      filterable: true,
      sortable: true,
      align: 'right'
    },
    {
      title: 'Пользователей',
      field: 'usersCount',
      type: PropertyType.INT,
      filterable: true,
      sortable: true,
      align: 'right'
    },
    {
      title: 'Действия',
      align: 'right',
      cellProps: { padding: 'checkbox' },
      CellContent: OrgGroupsGroupActions
    }
  ];

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);

    if (organizationSettings.showPermissions) {
      this.xTableCols.splice(-1, 0, {
        title: 'Разрешений',
        CellContent: OrgGroupsPermissionsCount,
        align: 'right'
      });
    }
  }

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
}
