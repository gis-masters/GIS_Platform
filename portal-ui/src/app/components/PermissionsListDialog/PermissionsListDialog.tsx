import React, { Component, ReactElement } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allPermissions } from '../../stores/AllPermissions.store';
import { RoleAssignmentBody, PrincipalType, projectRoles } from '../../services/crg/permissions.models';
import { PermissionsListItem } from '../../services/crg/allPermissions.service';
import { communicationService } from '../../services/communication.service';
import { CrgProject } from '../../services/crg/projects.models';
import { Dataset, DataTable, tablesEqual } from '../../services/data.service';
import {
  addDatasetPermission,
  addProjectPermission,
  addTablePermission,
  removeDatasetPermission,
  removeProjectPermission,
  removeTablePermission
} from '../../services/crg/permissions.client';
import { TextBadge } from '../TextBadge/TextBadge';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { XTable } from '../XTable/XTable';

import { PermissionsXTablePropsSet, PermissionsListItemType, baseXTablePropsSet } from './PermissionsListDialog.models';
import { PermissionsListRoleSelect } from './RoleSelect/PermissionsListDialog-RoleSelect';
import { PermissionsListActions } from './Actions/PermissionsListDialog-Actions';
import { PermissionsListDialogAdd } from './Add/PermissionsListDialog-Add';

import '!style-loader!css-loader!sass-loader!./Table/PermissionsListDialog-Table.scss';
import '!style-loader!css-loader!sass-loader!./Paper/PermissionsListDialog-Paper.scss';

const cnPermissionsListDialog = cn('PermissionsListDialog');

interface PermissionsListProps {
  principalId: number;
  principalType: PrincipalType;
  principalName: string;
  open: boolean;
  onClose: () => void;
}

@observer
export class PermissionsListDialog extends Component<PermissionsListProps> {
  @observable private loading = false;
  @observable private changedProjectsList?: PermissionsListItem<CrgProject>[];
  @observable private changedTablesList?: PermissionsListItem<DataTable>[];
  @observable private changedDatasetsList?: PermissionsListItem<Dataset>[];
  @observable private activeTab: PermissionsListItemType = PermissionsListItemType.PROJECT;

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
        <DialogContent>
          <XTable<any>
            className={cnPermissionsListDialog('Table')}
            title={
              <>
                Разрешения
                {principalType === PrincipalType.USER && ' пользователя '}
                {principalType === PrincipalType.GROUP && ' группы '}
                {principalName}
                <TextBadge id={principalId} />
                <Tabs
                  value={this.activeTab}
                  indicatorColor='primary'
                  textColor='primary'
                  onChange={this.tabChangeHandler}
                >
                  <Tab label='Проекты' value={PermissionsListItemType.PROJECT} />
                  <Tab label='Векторные слои' value={PermissionsListItemType.TABLE} />
                  <Tab label='Наборы данных' value={PermissionsListItemType.DATASET} />
                </Tabs>
              </>
            }
            headerActions={
              <PermissionsListDialogAdd
                onAdd={this.handleAdd}
                usedProjects={this.viewedProjects}
                usedTables={this.viewedTables}
                usedDatasets={this.viewedDatasets}
                principalId={principalId}
                principalType={principalType}
                type={this.activeTab}
              />
            }
            {...this.tableProps[this.activeTab]}
            filterable
          />
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
  private get tableProps(): PermissionsXTablePropsSet {
    return {
      [PermissionsListItemType.PROJECT]: {
        ...baseXTablePropsSet[PermissionsListItemType.PROJECT],
        data: this.viewedProjects,
        cols: [
          ...baseXTablePropsSet[PermissionsListItemType.PROJECT].cols,
          {
            // eslint-disable-next-line sonarjs/no-duplicate-string -- линтер тут не прав
            title: 'Разрешения',
            cellProps: { padding: 'checkbox' },
            align: 'right',
            CellContent: this.renderProjectRoleSelect
          },
          {
            title: 'Действия',
            cellProps: { padding: 'checkbox' },
            align: 'right',
            CellContent: this.renderProjectActions
          }
        ]
      },
      [PermissionsListItemType.TABLE]: {
        ...baseXTablePropsSet[PermissionsListItemType.TABLE],
        data: this.viewedTables,
        cols: [
          ...baseXTablePropsSet[PermissionsListItemType.TABLE].cols,
          {
            title: 'Разрешения',
            cellProps: { padding: 'checkbox' },
            align: 'right',
            CellContent: this.renderTableRoleSelect
          },
          {
            title: 'Действия',
            cellProps: { padding: 'checkbox' },
            align: 'right',
            CellContent: this.renderTableActions
          }
        ],
        defaultSort: { field: 'createdAt', asc: false },
        secondarySortField: 'identifier'
      },
      [PermissionsListItemType.DATASET]: {
        ...baseXTablePropsSet[PermissionsListItemType.DATASET],
        data: this.viewedDatasets,
        cols: [
          ...baseXTablePropsSet[PermissionsListItemType.DATASET].cols,
          {
            title: 'Разрешения',
            cellProps: { padding: 'checkbox' },
            align: 'right',
            CellContent: this.renderDatasetRoleSelect
          },
          {
            title: 'Действия',
            cellProps: { padding: 'checkbox' },
            align: 'right',
            CellContent: this.renderDatasetActions
          }
        ],
        defaultSort: { field: 'createdAt', asc: false },
        secondarySortField: 'identifier'
      }
    };
  }

  @computed
  private get currentProjectsPermissions(): PermissionsListItem<CrgProject>[] {
    return this.changedProjectsList || this.existingProjectsList;
  }

  @computed
  private get currentTablesPermissions(): PermissionsListItem<DataTable>[] {
    return this.changedTablesList || this.existingTablesList;
  }

  @computed
  private get currentDatasetsPermissions(): PermissionsListItem<Dataset>[] {
    return this.changedDatasetsList || this.existingDatasetsList;
  }

  @computed
  private get existingProjectsList(): PermissionsListItem<CrgProject>[] {
    return this.preparePermissionsList(allPermissions.forProjects);
  }

  @computed
  private get existingTablesList(): PermissionsListItem<DataTable>[] {
    return this.preparePermissionsList(allPermissions.forTables);
  }

  @computed
  private get existingDatasetsList(): PermissionsListItem<Dataset>[] {
    return this.preparePermissionsList(allPermissions.forDatasets);
  }

  private preparePermissionsList<T>(items: PermissionsListItem<T>[]): PermissionsListItem<T>[] {
    const { principalId, principalType } = this.props;

    return items
      .map(item => ({
        ...item,
        permissions: item.permissions.filter(
          permission => permission.principalId === principalId && permission.principalType === principalType
        )
      }))
      .filter(({ permissions }) => permissions.length);
  }

  @computed
  private get changed(): boolean {
    return !this.changedProjectsList;
  }

  @computed
  private get viewedProjects(): CrgProject[] {
    return this.currentProjectsPermissions.map(({ entity }) => entity);
  }

  @computed
  private get viewedTables(): DataTable[] {
    return this.currentTablesPermissions.map(({ entity }) => entity);
  }

  @computed
  private get viewedDatasets(): Dataset[] {
    return this.currentDatasetsPermissions.map(({ entity }) => entity);
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  private initChangedLists() {
    if (!this.changedProjectsList) {
      this.changedProjectsList = this.existingProjectsList;
    }
    if (!this.changedTablesList) {
      this.changedTablesList = this.existingTablesList;
    }
    if (!this.changedDatasetsList) {
      this.changedDatasetsList = this.existingDatasetsList;
    }
  }

  @action.bound
  private handleProjectDelete(projectId: number) {
    this.initChangedLists();

    this.changedProjectsList.splice(
      this.changedProjectsList.findIndex(({ entity }) => entity.id === projectId),
      1
    );
  }

  @action.bound
  private handleTableDelete(tableId: string, datasetId: string) {
    this.initChangedLists();

    this.changedTablesList.splice(
      this.changedTablesList.findIndex(({ entity }) => entity.identifier === tableId && entity.dataset === datasetId),
      1
    );
  }

  @action.bound
  private handleDatasetDelete(datasetId: string) {
    this.initChangedLists();

    this.changedDatasetsList.splice(
      this.changedDatasetsList.findIndex(({ entity }) => entity.identifier === datasetId),
      1
    );
  }

  @action.bound
  private handleProjectRolesChange(newItem: PermissionsListItem<CrgProject>) {
    this.initChangedLists();

    const changedIndex = this.changedProjectsList.findIndex(({ entity }) => entity.id === newItem.entity.id);

    this.changedProjectsList.splice(changedIndex, 1, newItem);
  }

  @action.bound
  private handleTableRolesChange(newItem: PermissionsListItem<DataTable>) {
    this.initChangedLists();

    const changedIndex = this.changedTablesList.findIndex(
      ({ entity }) => entity.identifier === newItem.entity.identifier && entity.dataset === newItem.entity.dataset
    );

    this.changedTablesList.splice(changedIndex, 1, newItem);
  }

  @action.bound
  private handleDatasetRolesChange(newItem: PermissionsListItem<Dataset>) {
    this.initChangedLists();

    const changedIndex = this.changedDatasetsList.findIndex(
      ({ entity }) => entity.identifier === newItem.entity.identifier
    );

    this.changedDatasetsList.splice(changedIndex, 1, newItem);
  }

  @boundMethod
  private handleAdd(items: PermissionsListItem[]) {
    this.initChangedLists();
    switch (this.activeTab) {
      case PermissionsListItemType.PROJECT: {
        this.handleProjectAdd(items as PermissionsListItem<CrgProject>[]);
        break;
      }
      case PermissionsListItemType.TABLE: {
        this.handleTableAdd(items as PermissionsListItem<DataTable>[]);
        break;
      }
      case PermissionsListItemType.DATASET: {
        this.handleDatasetAdd(items as PermissionsListItem<Dataset>[]);
        break;
      }
    }
  }

  @action
  private handleProjectAdd(items: PermissionsListItem<CrgProject>[]) {
    items.forEach(item => {
      item.permissions.forEach(permission => {
        if (!projectRoles.includes(permission.role)) {
          permission.role = projectRoles[0];
        }
      });
    });
    this.changedProjectsList = [...this.changedProjectsList, ...items];
  }

  @action
  private handleTableAdd(items: PermissionsListItem<DataTable>[]) {
    this.changedTablesList = [...this.changedTablesList, ...items];
  }

  @action
  private handleDatasetAdd(items: PermissionsListItem<Dataset>[]) {
    this.changedDatasetsList = [...this.changedDatasetsList, ...items];
  }

  @boundMethod
  private close() {
    this.props.onClose();
    setTimeout(this.dropChangedList, 300);
  }

  @action.bound
  private dropChangedList() {
    this.changedProjectsList = undefined;
  }

  @boundMethod
  private async save() {
    this.setLoading(true);

    // projects

    const toCreateProjects: [CrgProject, RoleAssignmentBody][] = [];
    const leftProjects = this.prepareFlatList(this.existingProjectsList);
    const changedProjects = this.prepareFlatList(this.changedProjectsList);

    changedProjects.forEach(([changedProject, changedPermission]) => {
      const index = leftProjects.findIndex(
        ([existingProject, existingPermission]) =>
          changedPermission.role === existingPermission.role && changedProject.id === existingProject.id
      );
      if (index === -1) {
        toCreateProjects.push([changedProject, changedPermission]);
      } else {
        leftProjects.splice(index, 1);
      }
    });

    for (const [project, permission] of leftProjects) {
      await removeProjectPermission(permission, project);
    }
    for (const [project, permission] of toCreateProjects) {
      await addProjectPermission(permission, project);
    }

    // tables

    const toCreateTables: [DataTable, RoleAssignmentBody][] = [];
    const leftTables = this.prepareFlatList(this.existingTablesList);
    const changedTables = this.prepareFlatList(this.changedTablesList);

    changedTables.forEach(([changedTable, changedPermission]) => {
      const index = leftTables.findIndex(
        ([existingTable, existingPermission]) =>
          changedPermission.role === existingPermission.role && tablesEqual(changedTable, existingTable)
      );
      if (index === -1) {
        toCreateTables.push([changedTable, changedPermission]);
      } else {
        leftTables.splice(index, 1);
      }
    });
    for (const [table, permission] of leftTables) {
      await removeTablePermission(permission, table.dataset, table.identifier);
    }
    for (const [table, permission] of toCreateTables) {
      await addTablePermission(permission, table.dataset, table.identifier);
    }

    // datasets

    const toCreateDatasets: [Dataset, RoleAssignmentBody][] = [];
    const leftDatasets = this.prepareFlatList(this.existingDatasetsList);
    const changedDatasets = this.prepareFlatList(this.changedDatasetsList);

    changedDatasets.forEach(([changedDataset, changedPermission]) => {
      const index = leftDatasets.findIndex(
        ([existingDataset, existingPermission]) =>
          changedPermission.role === existingPermission.role && changedDataset.identifier === existingDataset.identifier
      );
      if (index === -1) {
        toCreateDatasets.push([changedDataset, changedPermission]);
      } else {
        leftDatasets.splice(index, 1);
      }
    });

    for (const [dataset, permission] of leftDatasets) {
      await removeDatasetPermission(permission, dataset.identifier);
    }
    for (const [dataset, permission] of toCreateDatasets) {
      await addDatasetPermission(permission, dataset.identifier);
    }

    communicationService.permissionsUpdated.emit();
    this.setLoading(false);
    this.close();
  }

  private prepareFlatList<T>(list: PermissionsListItem<T>[]): [T, RoleAssignmentBody][] {
    return list.flatMap(({ entity, permissions }) =>
      permissions.map(roleAssignment => [entity, roleAssignment] as [T, RoleAssignmentBody])
    );
  }

  @boundMethod
  private renderProjectRoleSelect({ rowData }: { rowData: CrgProject }): ReactElement {
    const { principalId, principalType } = this.props;
    const item = this.currentProjectsPermissions.find(({ entity }) => entity.id === rowData.id);

    return (
      <PermissionsListRoleSelect
        listItem={item}
        onChange={this.handleProjectRolesChange}
        principalId={principalId}
        principalType={principalType}
        listItemType={PermissionsListItemType.PROJECT}
      />
    );
  }

  @boundMethod
  private renderTableRoleSelect({ rowData }: { rowData: DataTable }): ReactElement {
    const { principalId, principalType } = this.props;
    const item = this.currentTablesPermissions.find(
      ({ entity }) => entity.identifier === rowData.identifier && entity.dataset === rowData.dataset
    );

    return (
      <PermissionsListRoleSelect
        listItem={item}
        onChange={this.handleTableRolesChange}
        principalId={principalId}
        principalType={principalType}
        listItemType={PermissionsListItemType.TABLE}
      />
    );
  }

  @boundMethod
  private renderDatasetRoleSelect({ rowData }: { rowData: Dataset }): ReactElement {
    const { principalId, principalType } = this.props;
    const item = this.currentDatasetsPermissions.find(({ entity }) => entity.identifier === rowData.identifier);

    return (
      <PermissionsListRoleSelect
        listItem={item}
        onChange={this.handleDatasetRolesChange}
        principalId={principalId}
        principalType={principalType}
        listItemType={PermissionsListItemType.DATASET}
      />
    );
  }

  @boundMethod
  private renderProjectActions({ rowData }: { rowData: CrgProject }): ReactElement {
    return <PermissionsListActions id={rowData.id} onDelete={this.handleProjectDelete} />;
  }

  @boundMethod
  private renderTableActions({ rowData }: { rowData: DataTable }): ReactElement {
    return (
      <PermissionsListActions
        id={rowData.identifier}
        additionalId={rowData.dataset}
        onDelete={this.handleTableDelete}
      />
    );
  }

  @boundMethod
  private renderDatasetActions({ rowData }: { rowData: Dataset }): ReactElement {
    return <PermissionsListActions id={rowData.identifier} onDelete={this.handleDatasetDelete} />;
  }

  @action.bound
  private tabChangeHandler(e: React.ChangeEvent, value: PermissionsListItemType) {
    this.activeTab = value;
  }
}
