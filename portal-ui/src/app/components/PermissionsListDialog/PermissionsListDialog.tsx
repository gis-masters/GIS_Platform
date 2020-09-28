import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { boundMethod } from 'autobind-decorator';

import {
  RoleAssignmentBody,
  addPermission,
  removePermission,
  PrincipalType
} from '../../services/crg/permissions.service';
import { CrgProject, CrgLayer } from '../../services/crg/projects.models';
import { communicationService } from '../../services/communication.service';
import { FilterParams, filterObjects } from '../../services/util/filterObjects';
import { PermissionsListItem } from '../../services/crg/permissionsList.service';
import { SortParams, sortObjects } from '../../services/util/sortObjects';
import { permissionsList } from '../../stores/PermissionsList.store';
import { TableUnderFooter } from '../TableUnderFooter/TableUnderFooter';
import { TableHeadCell } from '../TableHeadCell/TableHeadCell';
import { Highlight } from '../Highlight/Highlight';
import { Loading } from '../Loading/Loading';
import { IdBadge } from '../IdBadge/IdBadge';
import { Button } from '../Button/Button';

import { PermissionsListEmpty } from './Empty/PermissionsListDialog-Empty';
import { PermissionsListDialogTable } from './Table/PermissionsListDialog-Table';
import { PermissionsListActions } from './Actions/PermissionsListDialog-Actions';
import { PermissionsListDialogTitle } from './Title/PermissionsListDialog-Title';
import { PermissionsListRoleSelect } from './RoleSelect/PermissionsListDialog-RoleSelect';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog.scss';

const cnPermissionsListDialog = cn('PermissionsListDialog');

type ApiArgs = [RoleAssignmentBody, CrgProject, CrgLayer];

interface PermissionsListProps {
  principalId: number;
  principalType: PrincipalType;
  principalName: string;
  open: boolean;
  onClose: () => void;
}

export interface PermissionsListItemWrapped {
  synteticId: string;
  projectTitle: string;
  layerTitle: string;
  schemaId: string;
  origin: PermissionsListItem;
}

export type ListSortParams = SortParams<PermissionsListItemWrapped>;
export type ListFilterParams = FilterParams<PermissionsListItemWrapped>;

@observer
export class PermissionsListDialog extends Component<PermissionsListProps> {
  @observable private loading = false;
  @observable private changedList?: PermissionsListItem[];
  @observable private sortParams: ListSortParams = { field: 'synteticId', asc: true };
  @observable private filterParams: ListFilterParams = {};
  @observable private filterEnabled = false;
  @observable private _page = 1;
  private rowsPerPage = 20;

  render() {
    const { principalId, principalType, principalName, open } = this.props;

    return (
      <Dialog
        onClose={this.close}
        open={open}
        maxWidth='xl'
        className={cnPermissionsListDialog()}
        PaperProps={{ className: cnPermissionsListDialog('Paper') }}
      >
        <DialogTitle>
          <PermissionsListDialogTitle
            principalId={principalId}
            principalType={principalType}
            principalName={principalName}
            currentList={this.currentList}
            onAdd={this.handleAdd}
            filterEnabled={this.filterEnabled}
            onFilterClick={this.toggleFilter}
          />
        </DialogTitle>
        <DialogContent>
          {this.currentList.length ? (
            <>
              <TableContainer component={PermissionsListDialogTable}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
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
                      <TableCell align='right'>Разрешения</TableCell>
                      <TableCell align='right'>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.listPaged.map(({ synteticId, projectTitle, layerTitle, schemaId, origin }) => (
                      <TableRow key={synteticId} hover>
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
                          <Highlight word={this.filterParams.schemaId} enabled={this.filterEnabled}>
                            {schemaId}
                          </Highlight>
                        </TableCell>
                        <TableCell align='right' padding='checkbox'>
                          <PermissionsListRoleSelect
                            listItem={origin}
                            onChange={this.handleRolesChange}
                            principalId={principalId}
                            principalType={principalType}
                          />
                        </TableCell>
                        <TableCell align='right' padding='checkbox'>
                          <PermissionsListActions item={origin} onDelete={this.handleDelete} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TableUnderFooter>
                <Pagination count={this.pagesCount} page={this.page} onChange={this.handlePagination} />
              </TableUnderFooter>
            </>
          ) : (
            !this.loading && <PermissionsListEmpty />
          )}

          <Loading noBackdrop visible={this.loading} />
        </DialogContent>
        <DialogActions>
          {this.changed ? (
            <Button onClick={this.close}>Закрыть</Button>
          ) : (
            <>
              <Button onClick={this.save} color='primary' disabled={this.loading}>
                Сохранить
              </Button>
              <Button onClick={this.close} disabled={this.loading}>
                Отмена
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get currentList(): PermissionsListItem[] {
    return this.changedList || this.existingList;
  }

  @computed
  private get existingList(): PermissionsListItem[] {
    const { principalId, principalType } = this.props;

    return permissionsList.list
      .map(item => ({
        ...item,
        permissions: item.permissions.filter(
          permission => Number(permission.principalId) === principalId && permission.principalType === principalType
        )
      }))
      .filter(({ permissions }) => permissions.length);
  }

  @computed
  private get changed(): boolean {
    return !this.changedList;
  }

  @computed
  private get list(): PermissionsListItemWrapped[] {
    const { field, asc } = this.sortParams;

    let preparedList = this.currentList.map(item => ({
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
  private get pagesCount(): number {
    return Math.ceil(this.list.length / this.rowsPerPage);
  }

  @computed
  private get page(): number {
    return Math.min(this._page, this.pagesCount);
  }

  @action.bound
  private toggleFilter() {
    this.filterEnabled = !this.filterEnabled;
  }

  @action
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  private initChangedList() {
    if (!this.changedList) {
      this.changedList = this.existingList;
    }
  }

  @action.bound
  private handleDelete(item: PermissionsListItem) {
    this.initChangedList();

    this.changedList.splice(this.changedList.indexOf(item), 1);
  }

  @action.bound
  private handleRolesChange(newItem: PermissionsListItem) {
    this.initChangedList();

    const changedIndex = this.changedList.findIndex(
      ({ project, layer }) =>
        project.id === newItem.project.id && (layer && layer.id) === (newItem.layer && newItem.layer.id)
    );

    this.changedList.splice(changedIndex, 1, newItem);
  }

  @action.bound
  private handleAdd(items: PermissionsListItem[]) {
    this.initChangedList();
    this.changedList = this.changedList.concat(items);
  }

  @boundMethod
  private close() {
    this.props.onClose();
    setTimeout(this.dropChangedList, 300);
  }

  @action.bound
  private dropChangedList() {
    this.changedList = undefined;
  }

  @action.bound
  private handlePagination(e: React.ChangeEvent<unknown>, value: number) {
    this._page = value;
  }

  @boundMethod
  private async save() {
    this.setLoading(true);

    const existing = this.prepareList(this.existingList);
    const changed = this.prepareList(this.changedList);
    const toCreate: ApiArgs[] = [];

    changed.forEach(changedItem => {
      const index = existing.findIndex(
        existingItem =>
          changedItem[0].role === existingItem[0].role &&
          changedItem[1].id === existingItem[1].id &&
          (changedItem[2] && changedItem[2].id) === (existingItem[2] && existingItem[2].id)
      );
      if (index === -1) {
        toCreate.push(changedItem);
      } else {
        existing.splice(index, 1);
      }
    });

    for (let item of toCreate) {
      await addPermission(...item);
    }

    for (let item of existing) {
      await removePermission(...item);
    }

    communicationService.permissionsUpdated.emit();

    this.setLoading(false);
    this.close();
  }

  private prepareList(list: PermissionsListItem[]): ApiArgs[] {
    return list
      .map(({ project, layer, permissions }) => {
        return permissions.map(roleAssignment => {
          return [roleAssignment, project, layer] as ApiArgs;
        });
      })
      .flat();
  }
}
