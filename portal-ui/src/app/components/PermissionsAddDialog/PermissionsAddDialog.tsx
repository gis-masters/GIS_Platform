import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Select,
  MenuItem
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { boundMethod } from 'autobind-decorator';

import {
  Role,
  roles,
  rolesTitles,
  getSetOfRoleAssignments,
  PrincipalType
} from '../../services/crg/permissions.service';
import { PermissionsListItem } from '../../services/crg/permissionsList.service';
import { permissionsList } from '../../stores/PermissionsList.store';
import { filterObjects } from '../../services/util/filterObjects';
import { sortObjects } from '../../services/util/sortObjects';
import { TableUnderFooter } from '../TableUnderFooter/TableUnderFooter';
import { TableHeadCell } from '../TableHeadCell/TableHeadCell';
import { FilterButton } from '../FilterButton/FilterButton';
import { Highlight } from '../Highlight/Highlight';
import { IdBadge } from '../IdBadge/IdBadge';
import { Button } from '../Button/Button';
import {
  ListSortParams,
  ListFilterParams,
  PermissionsListItemWrapped
} from '../PermissionsListDialog/PermissionsListDialog';

import { PermissionsAddDialogTable } from './Table/PermissionsAddDialog-Table';
import { PermissionsAddDialogItemCheck } from './ItemCheck/PermissionsAddDialog-ItemCheck';

import '!style-loader!css-loader!sass-loader!./PermissionsAddDialog.scss';
import '!style-loader!css-loader!sass-loader!./FilterButton/PermissionsAddDialog-FilterButton.scss';

const cnPermissionsAddDialog = cn('PermissionsAddDialog');

interface PermissionsAddDialogProps {
  currentList: PermissionsListItem[];
  principalId: number;
  principalType: PrincipalType;
  open: boolean;
  onClose: () => void;
  onAdd: (item: PermissionsListItem[]) => void;
}

@observer
export class PermissionsAddDialog extends Component<PermissionsAddDialogProps> {
  @observable selectedList: PermissionsListItem[] = [];
  @observable role: Role = Role.VIEWER;
  @observable private sortParams: ListSortParams = { field: 'synteticId', asc: true };
  @observable private filterParams: ListFilterParams = {};
  @observable private filterEnabled = false;
  @observable private page = 1;
  private rowsPerPage = 20;

  render() {
    const { open, currentList } = this.props;

    return (
      <Dialog
        className={cnPermissionsAddDialog()}
        open={open}
        onClose={this.close}
        maxWidth='xl'
        PaperProps={{ className: cnPermissionsAddDialog('Paper') }}
      >
        <DialogTitle>
          Добавление разрешений
          <FilterButton
            className={cnPermissionsAddDialog('FilterButton')}
            filterEnabled={this.filterEnabled}
            onClick={this.toggleFilter}
          />
        </DialogTitle>
        <DialogContent>
          {permissionsList.list.length ? (
            <>
              <TableContainer component={PermissionsAddDialogTable}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          indeterminate={this.selectedList.length > 0 && !this.allSelected}
                          checked={this.allSelected}
                          onChange={this.handleSelectAll}
                        />
                      </TableCell>
                      <TableHeadCell
                        field='projectTitle'
                        sorting
                        sortParams={this.sortParams}
                        filtering={this.filterEnabled}
                        filterParams={this.filterParams}
                      >
                        Проект
                      </TableHeadCell>
                      <TableHeadCell
                        field='layerTitle'
                        sorting
                        sortParams={this.sortParams}
                        filtering={this.filterEnabled}
                        filterParams={this.filterParams}
                      >
                        Слой
                      </TableHeadCell>
                      <TableHeadCell
                        field='schemaId'
                        sorting
                        sortParams={this.sortParams}
                        filtering={this.filterEnabled}
                        filterParams={this.filterParams}
                      >
                        Схема
                      </TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.listPaged.map(({ synteticId, projectTitle, layerTitle, schemaId, origin }) => (
                      <TableRow key={synteticId} hover>
                        <TableCell padding='checkbox'>
                          <PermissionsAddDialogItemCheck
                            item={origin}
                            selectedList={this.selectedList}
                            currentList={currentList}
                          />
                        </TableCell>
                        <TableCell>
                          <Highlight word={this.filterParams.projectTitle} enabled={this.filterEnabled}>
                            {projectTitle}
                          </Highlight>
                          <IdBadge id={origin.project.id} />
                        </TableCell>
                        <TableCell>
                          <Highlight word={this.filterParams.layerTitle} enabled={this.filterEnabled}>
                            {layerTitle}
                          </Highlight>
                          {origin.layer && <IdBadge id={origin.layer.id} />}
                        </TableCell>
                        <TableCell>
                          <Highlight word={this.filterParams.layerTitle} enabled={this.filterEnabled}>
                            {schemaId}
                          </Highlight>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TableUnderFooter>
                <Pagination
                  count={Math.ceil(this.list.length / this.rowsPerPage)}
                  page={this.page}
                  onChange={this.handlePagination}
                />
              </TableUnderFooter>
            </>
          ) : (
            'Ничего нет.'
          )}
        </DialogContent>
        <DialogActions>
          <Select value={this.role} onChange={this.handleRoleChange}>
            {roles.map(roleName => (
              <MenuItem value={roleName} key={roleName}>
                {rolesTitles[roleName]}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={this.add} color='primary' disabled={!this.selectedList.length}>
            Добавить
          </Button>
          <Button onClick={this.close}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get avaiableList(): PermissionsListItem[] {
    const { currentList } = this.props;

    return permissionsList.list.filter(
      item =>
        !item.broken &&
        !currentList.some(
          exItem =>
            exItem.project.id === item.project.id && (exItem.layer && exItem.layer.id) === (item.layer && item.layer.id)
        )
    );
  }

  @computed
  private get list(): PermissionsListItemWrapped[] {
    const { field, asc } = this.sortParams;

    let preparedList = permissionsList.list.map(item => ({
      synteticId: `${item.project.name}|${item.project.id}|${item.layer ? `${item.layer.title}|${item.layer.id}` : ''}`,
      projectTitle: item.project.name,
      layerTitle: item.layer ? item.layer.title : '\u2014',
      schemaId: item.layer ? item.layer.schemaId : '\u2014',
      origin: item
    }));

    if (this.filterEnabled) {
      preparedList = filterObjects(preparedList, this.filterParams);
    }

    return sortObjects(preparedList, field, asc, 'synteticId');
  }

  @computed
  private get listPaged(): PermissionsListItemWrapped[] {
    return this.list.slice((this.page - 1) * this.rowsPerPage, (this.page - 1) * this.rowsPerPage + this.rowsPerPage);
  }

  @computed
  private get allSelected(): boolean {
    return this.avaiableList.length > 0 && this.selectedList.length === this.avaiableList.length;
  }

  @action.bound
  private toggleFilter() {
    this.filterEnabled = !this.filterEnabled;
  }

  @boundMethod
  private add() {
    const { principalId, principalType, onAdd } = this.props;

    onAdd(
      this.selectedList.map(item => ({
        ...item,
        permissions: getSetOfRoleAssignments(principalId, principalType, this.role, Boolean(item.layer))
      }))
    );
    this.close();
  }

  @action.bound
  private close() {
    this.selectedList = [];
    this.role = Role.VIEWER;

    this.props.onClose();
  }

  @action.bound
  private handleSelectAll() {
    this.selectedList = this.allSelected ? [] : [...this.avaiableList];
  }

  @action.bound
  handleRoleChange(e: React.ChangeEvent<{ name?: string; value: Role }>) {
    this.role = e.target.value;
  }

  @action.bound
  private handlePagination(e: React.ChangeEvent<unknown>, value: number) {
    this.page = value;
  }
}
