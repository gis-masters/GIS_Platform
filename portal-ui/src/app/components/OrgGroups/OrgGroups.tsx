import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import { groupsList } from '../../stores/GroupsList.store';
import { permissionsList } from '../../stores/PermissionsList.store';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { PrincipalType } from '../../services/crg/permissions.service';
import { permissionsListService } from '../../services/crg/permissionsList.service';
import { FilterParams, filterObjects } from '../../services/util/filterObjects';
import { SortParams, sortObjects } from '../../services/util/sortObjects';
import { TableOverHead } from '../TableOverHead/TableOverHead';
import { TableHeadCell } from '../TableHeadCell/TableHeadCell';
import { FilterButton } from '../FilterButton/FilterButton';
import { OrgActions } from '../OrgActions/OrgActions';
import { Highlight } from '../Highlight/Highlight';
import { IdBadge } from '../IdBadge/IdBadge';

import { OrgGroupsCreate } from './Create/OrgGroups-Create';

const cnOrgGroups = cn('OrgGroups');

interface CrgGroupExtended extends CrgGroup {
  usersCount: number;
  permissionsCount: number;
}

type GroupSortParams = SortParams<CrgGroupExtended>;
type GroupFilterParams = FilterParams<CrgGroupExtended>;

@observer
export class OrgGroups extends Component {
  @observable private sortParams: GroupSortParams = { field: 'name', asc: true };
  @observable private filterParams: GroupFilterParams = {};
  @observable private filterEnabled = false;

  componentDidMount() {
    groupsService.initGroupsListStore();
    permissionsListService.initGroupsListStore();
  }

  render() {
    return (
      <div className={cnOrgGroups()}>
        <TableOverHead>
          <OrgGroupsCreate />
          <FilterButton filterEnabled={this.filterEnabled} onClick={this.toggleFilter} />
        </TableOverHead>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell
                  field='name'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                >
                  Название
                </TableHeadCell>
                <TableHeadCell
                  field='description'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                  align='right'
                >
                  Описание
                </TableHeadCell>
                <TableHeadCell
                  field='usersCount'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                  align='right'
                >
                  Пользователей
                </TableHeadCell>
                <TableHeadCell
                  field='permissionsCount'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                  align='right'
                >
                  Разрешений
                </TableHeadCell>
                <TableCell align='right'>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.groups.map(group => (
                <TableRow key={group.id}>
                  <TableCell component='th' scope='row'>
                    <Highlight word={this.filterParams.name} enabled={this.filterEnabled}>
                      {group.name}
                    </Highlight>
                    <IdBadge id={group.id} />
                  </TableCell>
                  <TableCell align='right'>
                    <Highlight word={this.filterParams.description} enabled={this.filterEnabled}>
                      {group.description}
                    </Highlight>
                  </TableCell>
                  <TableCell align='right'>
                    <Highlight word={this.filterParams.usersCount} enabled={this.filterEnabled}>
                      {group.usersCount}
                    </Highlight>
                  </TableCell>
                  <TableCell align='right'>
                    <Highlight word={this.filterParams.permissionsCount} enabled={this.filterEnabled}>
                      {group.permissionsCount}
                    </Highlight>
                  </TableCell>
                  <TableCell align='right' padding='checkbox'>
                    <OrgActions group={group} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  @computed
  private get groups(): CrgGroupExtended[] {
    const { field, asc } = this.sortParams;

    let preparedGroups = groupsList.list.map(group => ({
      ...group,
      usersCount: group.users.length,
      permissionsCount: permissionsList.list.filter(item =>
        item.permissions.find(
          ({ principalId, principalType }) => Number(principalId) === group.id && principalType === PrincipalType.GROUP
        )
      ).length
    }));

    if (this.filterEnabled) {
      preparedGroups = filterObjects(preparedGroups, this.filterParams);
    }

    return sortObjects(preparedGroups, field, asc, 'id');
  }

  @action.bound
  private toggleFilter() {
    this.filterEnabled = !this.filterEnabled;
  }
}
