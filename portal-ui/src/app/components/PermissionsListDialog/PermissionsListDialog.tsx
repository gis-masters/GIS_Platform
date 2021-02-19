import React, { Component, ReactNode } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { allPermissions } from '../../stores/AllPermissions.store';
import { RoleAssignmentBody, PrincipalType, projectRoles } from '../../services/crg/permissions.models';
import { PermissionsListItem } from '../../services/crg/allPermissions.service';
import { communicationService } from '../../services/communication.service';
import { CrgProject, CrgLayer } from '../../services/crg/projects.models';
import { FilterParams } from '../../services/util/filterObjects';
import {
  addProjectPermission,
  addTablePermission,
  removeProjectPermission,
  removeTablePermission
} from '../../services/crg/permissions.client';
import { Highlight } from '../Highlight/Highlight';
import { TextBadge } from '../TextBadge/TextBadge';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { XTable } from '../XTable/XTable';

import { PermissionsListDialogAdd } from './Add/PermissionsListDialog-Add';
import { PermissionsListActions } from './Actions/PermissionsListDialog-Actions';
import { PermissionsListRoleSelect } from './RoleSelect/PermissionsListDialog-RoleSelect';

import '!style-loader!css-loader!sass-loader!./Table/PermissionsListDialog-Table.scss';
import '!style-loader!css-loader!sass-loader!./Paper/PermissionsListDialog-Paper.scss';

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

@observer
export class PermissionsListDialog extends Component<PermissionsListProps> {
  @observable private loading = false;
  @observable private changedList?: PermissionsListItem[];

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
          <XTable
            className={cnPermissionsListDialog('Table')}
            title={
              <>
                Разрешения
                {principalType === PrincipalType.USER && ' пользователя '}
                {principalType === PrincipalType.GROUP && ' группы '}
                {principalName}
                <TextBadge id={principalId} />
              </>
            }
            headerActions={
              <PermissionsListDialogAdd
                onAdd={this.handleAdd}
                currentList={this.currentList}
                principalId={principalId}
                principalType={principalType}
              />
            }
            data={this.viewedList}
            cols={[
              {
                title: 'Проект',
                field: 'projectTitle',
                filtering: true,
                sorting: true,
                getIdBadge: ({ origin }) => origin.project.id
              },
              {
                title: 'Слой',
                field: 'layerTitle',
                filtering: true,
                sorting: true,
                renderCellContent: this.renderLayerTitle
              },
              {
                title: 'Схема',
                field: 'schemaId',
                filtering: true,
                sorting: true
              },
              {
                title: 'Разрешения',
                cellProps: { padding: 'checkbox' },
                align: 'right',
                renderCellContent: this.renderRoleSelect
              },
              {
                title: 'Действия',
                cellProps: { padding: 'checkbox' },
                align: 'right',
                renderCellContent: this.renderActions
              }
            ]}
            defaultSort={{ field: 'synteticId', asc: true }}
            secondarySortField='synteticId'
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
  private get currentList(): PermissionsListItem[] {
    return this.changedList || this.existingList;
  }

  @computed
  private get existingList(): PermissionsListItem[] {
    const { principalId, principalType } = this.props;

    return allPermissions.list
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
    return !this.changedList;
  }

  @computed
  private get viewedList(): PermissionsListItemWrapped[] {
    return this.currentList.map(item => ({
      synteticId: `${item.project.name}|${item.project.id}|${item.layer ? `${item.layer.title}|${item.layer.id}` : ''}`,
      projectTitle: item.project.name,
      layerTitle: item.layer ? item.layer.title : '\u2014',
      schemaId: item.layer ? item.layer.schemaId : '\u2014',
      origin: item
    }));
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

    this.changedList.splice(
      this.changedList.findIndex(listItem => isEqual(listItem, item)),
      1
    );
  }

  @action.bound
  private handleRolesChange(newItem: PermissionsListItem) {
    this.initChangedList();

    const changedIndex = this.changedList.findIndex(
      ({ project, layer }) => project.id === newItem.project.id && layer?.id === newItem.layer?.id
    );

    this.changedList.splice(changedIndex, 1, newItem);
  }

  @action.bound
  private handleAdd(items: PermissionsListItem[]) {
    this.initChangedList();
    items.forEach(item => {
      item.permissions.forEach(permission => {
        if (item.project && !item.layer && !projectRoles.includes(permission.role)) {
          permission.role = projectRoles[0];
        }
      });
    });
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

  @boundMethod
  private async save() {
    this.setLoading(true);

    const existing = this.prepareApiArgsList(this.existingList);
    const changed = this.prepareApiArgsList(this.changedList);
    const toCreate: ApiArgs[] = [];
    const toDelete: ApiArgs[] = [];

    changed.forEach(([changedPermission, changedProject, changedLayer]) => {
      const index = existing.findIndex(
        ([existingPermission, existingProject, existingLayer]) =>
          changedPermission.role === existingPermission.role &&
          changedProject.id === existingProject.id &&
          changedLayer?.id === existingLayer?.id
      );

      if (index === -1) {
        toCreate.push([changedPermission, changedProject, changedLayer]);
      } else {
        existing.splice(index, 1);
      }
    });

    toDelete.splice(toDelete.length, 0, ...existing);

    for (let [permission, project, layer] of toDelete) {
      if (layer) {
        await removeTablePermission(permission, layer.dataset, layer.tableName);
      } else {
        await removeProjectPermission(permission, project);
      }
    }

    for (let [permission, project, layer] of toCreate) {
      if (layer) {
        await addTablePermission(permission, layer.dataset, layer.tableName);
      } else {
        await addProjectPermission(permission, project);
      }
    }

    communicationService.permissionsUpdated.emit();
    this.setLoading(false);
    this.close();
  }

  private prepareApiArgsList(list: PermissionsListItem[]): ApiArgs[] {
    return list
      .map(({ project, layer, permissions }) =>
        permissions.map(roleAssignment => [roleAssignment, project, layer] as ApiArgs)
      )
      .flat();
  }

  @boundMethod
  private renderLayerTitle(
    item: PermissionsListItemWrapped,
    filterActive: boolean,
    filterParams: FilterParams<PermissionsListItemWrapped>
  ) {
    return (
      <>
        <Highlight word={filterParams.layerTitle} enabled={filterActive}>
          {item.layerTitle}
        </Highlight>
        {item.origin.layer && <TextBadge id={item.origin.layer.id} />}
      </>
    );
  }

  @boundMethod
  private renderRoleSelect(item: PermissionsListItemWrapped): ReactNode {
    const { principalId, principalType } = this.props;

    return (
      <PermissionsListRoleSelect
        listItem={item.origin}
        onChange={this.handleRolesChange}
        principalId={principalId}
        principalType={principalType}
      />
    );
  }

  @boundMethod
  private renderActions(item: PermissionsListItemWrapped): ReactNode {
    return <PermissionsListActions item={item.origin} onDelete={this.handleDelete} />;
  }
}
