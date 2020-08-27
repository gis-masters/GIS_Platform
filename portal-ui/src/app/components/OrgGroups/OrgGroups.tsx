import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { cn } from '@bem-react/classname';

import { groupsList } from '../../stores/GroupsList.store';
import { permissionsList } from '../../stores/PermissionsList.store';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { PrincipalType } from '../../services/crg/permissions.service';
import { permissionsListService } from '../../services/crg/permissionsList.service';
import { FilterParams, filterObjects } from '../../services/util/filterObjects';
import { SortParams, sortObjects } from '../../services/util/sortObjects';
import { TableUnderFooter } from '../TableUnderFooter/TableUnderFooter';
import { TableOverHead } from '../TableOverHead/TableOverHead';
import { TableHeadCell } from '../TableHeadCell/TableHeadCell';
import { FilterButton } from '../FilterButton/FilterButton';
import { OrgActions } from '../OrgActions/OrgActions';
import { Highlight } from '../Highlight/Highlight';
import { IdBadge } from '../IdBadge/IdBadge';

import { OrgGroupsCreate } from './Create/OrgGroups-Create';

import '!style-loader!css-loader!sass-loader!./OrgGroups.scss';

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
  @observable private page = 1;
  private rowsPerPage = 20;

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
        <TableContainer component={Paper} className='scroll'>
          <Table stickyHeader>
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
              {this.pagedGroups.map(group => (
                <TableRow key={group.id} hover>
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
        <TableUnderFooter>
          <Pagination
            count={Math.ceil(groupsList.list.length / this.rowsPerPage)}
            page={this.page}
            onChange={this.handlePagination}
          />
        </TableUnderFooter>
      </div>
    );
  }

  @computed
  private get groups(): CrgGroupExtended[] {
    return groupsList.list.map(group => ({
      ...group,
      usersCount: group.users.length,
      permissionsCount: permissionsList.list.filter(item =>
        item.permissions.find(
          ({ principalId, principalType }) => Number(principalId) === group.id && principalType === PrincipalType.GROUP
        )
      ).length
    }));
  }

  @computed
  private get filteredAndSortedGroups(): CrgGroupExtended[] {
    const { field, asc } = this.sortParams;
    let groups = this.groups;

    if (this.filterEnabled) {
      groups = filterObjects(groups, this.filterParams);
    }

    return sortObjects(groups, field, asc, 'id');
  }

  @computed
  private get pagedGroups(): CrgGroupExtended[] {
    return this.filteredAndSortedGroups.slice(
      (this.page - 1) * this.rowsPerPage,
      (this.page - 1) * this.rowsPerPage + this.rowsPerPage
    );
  }

  @action.bound
  private toggleFilter() {
    this.filterEnabled = !this.filterEnabled;
  }

  @action.bound
  private handlePagination(e: React.ChangeEvent<unknown>, value: number) {
    this.page = value;
  }
}
