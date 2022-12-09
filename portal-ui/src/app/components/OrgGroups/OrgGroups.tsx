import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { allGroups } from '../../stores/AllGroups.store';
import { CrgGroup, groupsService } from '../../services/data/groups.service';
import { PropertyType } from '../../services/data/schema.models';
import { XTable, XTableColumn } from '../XTable/XTable';

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
      title: 'Разрешений',
      CellContent: OrgGroupsPermissionsCount,
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
