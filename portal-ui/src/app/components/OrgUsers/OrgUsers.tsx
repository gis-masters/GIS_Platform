import React, { Component } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { TableContainer, Paper, Table, TableRow, TableBody, TableCell, TableHead } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Done, Block, FilterList } from '@material-ui/icons';
import { cn } from '@bem-react/classname';

import { FilterParams, filterObjects, CustomFilterFieldsPrep } from '../../services/util/filterObjects';
import { SortParams, sortObjects, CustomSortFieldsPrep } from '../../services/util/sortObjects';
import { permissionsListService } from '../../services/crg/permissionsList.service';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { CrgUser, usersService } from '../../services/crg/users.service';
import { PrincipalType } from '../../services/crg/permissions.service';
import { permissionsList } from '../../stores/PermissionsList.store';
import { groupsList } from '../../stores/GroupsList.store';
import { usersList } from '../../stores/UsersList.store';
import { TableUnderFooter } from '../TableUnderFooter/TableUnderFooter';
import { TableOverHead } from '../TableOverHead/TableOverHead';
import { TableHeadCell } from '../TableHeadCell/TableHeadCell';
import { FilterButton } from '../FilterButton/FilterButton';
import { OrgActions } from '../OrgActions/OrgActions';
import { Highlight } from '../Highlight/Highlight';
import { IdBadge } from '../IdBadge/IdBadge';

import { OrgUsersCreate } from './Create/OrgUsers-Create';

import '!style-loader!css-loader!sass-loader!./OrgUsers.scss';

const cnOrgUsers = cn('OrgUsers');

interface CrgUserExtended extends CrgUser {
  groups: CrgGroup[];
  permissionsCount: number;
}

type UserSortParams = SortParams<CrgUserExtended>;
type UserFilterParams = FilterParams<CrgUserExtended>;

const customSortFieldsPrep: CustomSortFieldsPrep<CrgUserExtended> = {
  groups: groups => String(groups.length).padStart(5, '0') + groups.map(group => group.name).join(', ')
};

const customFilterFieldsPrep: CustomFilterFieldsPrep<CrgUserExtended> = {
  groups: groups => groups.map(group => group.name).join(', ')
};

@observer
export class OrgUsers extends Component {
  @observable private sortParams: UserSortParams = { field: 'surName', asc: true };
  @observable private filterParams: UserFilterParams = {};
  @observable private filterEnabled = false;
  @observable private page = 1;
  private rowsPerPage = 20;

  componentDidMount() {
    usersService.initUsersListStore();
    groupsService.initGroupsListStore();
    permissionsListService.initGroupsListStore();
  }

  render() {
    return (
      <div className={cnOrgUsers()}>
        <TableOverHead>
          <OrgUsersCreate />
          <FilterButton filterEnabled={this.filterEnabled} onClick={this.toggleFilter} />
        </TableOverHead>
        <TableContainer component={Paper} className='scroll'>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeadCell
                  field='surName'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                >
                  Фамилия
                </TableHeadCell>
                <TableHeadCell
                  field='name'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                >
                  Имя
                </TableHeadCell>
                <TableHeadCell field='enabled' sorting sortParams={this.sortParams} align='right'>
                  Активен
                </TableHeadCell>
                <TableHeadCell
                  field='email'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                  align='right'
                >
                  e-mail / username
                </TableHeadCell>
                <TableHeadCell
                  field='groups'
                  sorting
                  sortParams={this.sortParams}
                  filtering={this.filterEnabled}
                  filterParams={this.filterParams}
                  align='right'
                >
                  Группы
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
              {this.pagedUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell component='th' scope='row'>
                    <Highlight word={this.filterParams.surName} enabled={this.filterEnabled}>
                      {user.surName}
                    </Highlight>
                  </TableCell>
                  <TableCell>
                    <Highlight word={this.filterParams.name} enabled={this.filterEnabled}>
                      {user.name}
                    </Highlight>
                  </TableCell>
                  <TableCell align='right'>{user.enabled ? <Done /> : <Block />}</TableCell>
                  <TableCell align='right'>
                    <Highlight word={this.filterParams.email} enabled={this.filterEnabled}>
                      {user.email}
                    </Highlight>
                    {user.email !== user.username && ` / ${user.username}`}
                    <IdBadge id={user.id} />
                  </TableCell>
                  <TableCell align='right'>
                    <Highlight word={this.filterParams.groups} enabled={this.filterEnabled}>
                      {user.groups.map(group => group.name).join(', ')}
                    </Highlight>
                  </TableCell>
                  <TableCell align='right'>
                    <Highlight word={this.filterParams.permissionsCount} enabled={this.filterEnabled}>
                      {user.permissionsCount}
                    </Highlight>
                  </TableCell>
                  <TableCell align='right' padding='checkbox'>
                    <OrgActions user={user} userGroups={user.groups} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableUnderFooter>
          <Pagination
            count={Math.ceil(usersList.list.length / this.rowsPerPage)}
            page={this.page}
            onChange={this.handlePagination}
          />
        </TableUnderFooter>
      </div>
    );
  }

  @computed
  private get users(): CrgUserExtended[] {
    return usersList.list.map(user => ({
      ...user,
      groups: groupsList.list.filter(group => group.users.some(({ id }) => id === user.id)),
      permissionsCount: permissionsList.list.filter(item =>
        item.permissions.find(
          ({ principalId, principalType }) => Number(principalId) === user.id && principalType === PrincipalType.USER
        )
      ).length
    }));
  }

  @computed
  private get filteredAndSortedUsers(): CrgUserExtended[] {
    const { field, asc } = this.sortParams;
    let users = this.users;

    if (this.filterEnabled) {
      users = filterObjects(users, this.filterParams, customFilterFieldsPrep);
    }

    return sortObjects(users, field, asc, 'id', customSortFieldsPrep);
  }

  @computed
  private get pagedUsers(): CrgUserExtended[] {
    return this.filteredAndSortedUsers.slice(
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
