import React, { Component, ReactNode } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, Checkbox, Select, MenuItem } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { Role, roles, rolesTitles, PrincipalType } from '../../services/crg/permissions.service';
import { PermissionsListItem } from '../../services/crg/allPermissions.service';
import { allPermissions } from '../../stores/AllPermissions.store';
import { FilterParams } from '../../services/util/filterObjects';
import { Highlight } from '../Highlight/Highlight';
import { TextBadge } from '../TextBadge/TextBadge';
import { Button } from '../Button/Button';
import { PermissionsListItemWrapped } from '../PermissionsListDialog/PermissionsListDialog';
import { XTable } from '../XTable/XTable';

import { PermissionsAddDialogItemCheck } from './ItemCheck/PermissionsAddDialog-ItemCheck';

import '!style-loader!css-loader!sass-loader!./Paper/PermissionsAddDialog-Paper.scss';

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

  render() {
    const { open } = this.props;

    return (
      <Dialog
        className={cnPermissionsAddDialog()}
        open={open}
        onClose={this.close}
        maxWidth='xl'
        PaperProps={{ className: cnPermissionsAddDialog('Paper') }}
      >
        <DialogContent>
          <XTable
            title='Добавление разрешений'
            data={this.list}
            cols={[
              {
                title: (
                  <Checkbox
                    indeterminate={this.selectedList.length > 0 && !this.allSelected}
                    checked={this.allSelected}
                    onChange={this.handleSelectAll}
                  />
                ),
                cellProps: { padding: 'checkbox' },
                renderCellContent: this.renderCheckbox
              },
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
              }
            ]}
            defaultSort={{ field: 'synteticId', asc: true }}
            secondarySortField='synteticId'
            filterable
          />
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

    return allPermissions.list.filter(
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
    return allPermissions.list.map(item => ({
      synteticId: `${item.project.name}|${item.project.id}|${item.layer ? `${item.layer.title}|${item.layer.id}` : ''}`,
      projectTitle: item.project.name,
      layerTitle: item.layer ? item.layer.title : '\u2014',
      schemaId: item.layer ? item.layer.schemaId : '\u2014',
      origin: item
    }));
  }

  @computed
  private get allSelected(): boolean {
    return this.avaiableList.length > 0 && this.selectedList.length === this.avaiableList.length;
  }

  @boundMethod
  private add() {
    const { principalId, principalType, onAdd } = this.props;

    onAdd(
      this.selectedList.map(item => ({
        ...item,
        permissions: [{ principalId, principalType, role: this.role }]
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
  private handleRoleChange(e: React.ChangeEvent<{ name?: string; value: Role }>) {
    this.role = e.target.value;
  }

  @boundMethod
  private renderCheckbox(item: PermissionsListItemWrapped): ReactNode {
    return (
      <PermissionsAddDialogItemCheck
        item={item.origin}
        selectedList={this.selectedList}
        currentList={this.props.currentList}
      />
    );
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
}
