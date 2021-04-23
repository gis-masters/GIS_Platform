import React, { Component, ReactNode } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, Checkbox, Select, MenuItem } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { allProjects } from '../../stores/AllProjects.store';
import { allDataEntitiesStore } from '../../stores/AllDataEntitiesStore';
import { Role, roles, rolesTitles, PrincipalType, projectRoles } from '../../services/crg/permissions.models';
import { PermissionsListItem } from '../../services/crg/allPermissions.service';
import { Dataset, DataTable, tablesEqual } from '../../services/data.service';
import { CrgProject } from '../../services/crg/projects.models';
import {
  baseXTablePropsSet,
  PermissionsListItemType,
  PermissionsXTablePropsSet
} from '../PermissionsListDialog/PermissionsListDialog.models';
import { XTable, XTableColumn } from '../XTable/XTable';
import { Button } from '../Button/Button';

import { PermissionsAddDialogItemCheck } from './ItemCheck/PermissionsAddDialog-ItemCheck';

import '!style-loader!css-loader!sass-loader!./Paper/PermissionsAddDialog-Paper.scss';

const cnPermissionsAddDialog = cn('PermissionsAddDialog');

interface PermissionsAddDialogProps {
  usedProjects: CrgProject[];
  usedTables: DataTable[];
  usedDatasets: Dataset[];
  principalId: number;
  principalType: PrincipalType;
  open: boolean;
  onClose: () => void;
  onAdd: (item: PermissionsListItem[]) => void;
  type: PermissionsListItemType;
}

@observer
export class PermissionsAddDialog extends Component<PermissionsAddDialogProps> {
  @observable selectedItems: CrgProject[] | DataTable[] | Dataset[] = [];
  @observable role: Role = Role.VIEWER;

  render() {
    const { open, type } = this.props;

    return (
      <Dialog
        className={cnPermissionsAddDialog()}
        open={open}
        onClose={this.close}
        maxWidth='xl'
        PaperProps={{ className: cnPermissionsAddDialog('Paper') }}
      >
        <DialogContent>
          <XTable<any> title='Добавление разрешений' {...this.tableProps[type]} data={this.availableItems} filterable />
        </DialogContent>
        <DialogActions>
          <Select value={this.role} onChange={this.handleRoleChange}>
            {(type === PermissionsListItemType.PROJECT ? projectRoles : roles).map(roleName => (
              <MenuItem value={roleName} key={roleName}>
                {rolesTitles[roleName]}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={this.add} color='primary' disabled={!this.selectedItems.length}>
            Добавить
          </Button>
          <Button onClick={this.close}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get checkboxCol(): XTableColumn<unknown> {
    return {
      title: (
        <Checkbox
          indeterminate={this.selectedItems.length > 0 && !this.allSelected}
          checked={this.allSelected}
          onChange={this.handleSelectAll}
        />
      ),
      cellProps: { padding: 'checkbox' },
      renderCellContent: this.renderCheckbox
    };
  }

  @computed
  private get tableProps(): PermissionsXTablePropsSet {
    return {
      [PermissionsListItemType.PROJECT]: {
        ...baseXTablePropsSet[PermissionsListItemType.PROJECT],
        cols: [this.checkboxCol, ...baseXTablePropsSet[PermissionsListItemType.PROJECT].cols]
      },
      [PermissionsListItemType.TABLE]: {
        ...baseXTablePropsSet[PermissionsListItemType.TABLE],
        cols: [this.checkboxCol, ...baseXTablePropsSet[PermissionsListItemType.TABLE].cols],
        defaultSort: { field: 'createdAt', asc: false },
        secondarySortField: 'identifier'
      },
      [PermissionsListItemType.DATASET]: {
        ...baseXTablePropsSet[PermissionsListItemType.DATASET],
        cols: [this.checkboxCol, ...baseXTablePropsSet[PermissionsListItemType.DATASET].cols],
        defaultSort: { field: 'createdAt', asc: false },
        secondarySortField: 'identifier'
      }
    };
  }

  @computed
  private get availableItems(): CrgProject[] | DataTable[] | Dataset[] {
    return {
      [PermissionsListItemType.PROJECT]: allProjects.list,
      [PermissionsListItemType.TABLE]: allDataEntitiesStore.dataTables,
      [PermissionsListItemType.DATASET]: allDataEntitiesStore.datasets
    }[this.props.type];
  }

  @computed
  private get usedItems(): CrgProject[] | DataTable[] | Dataset[] {
    const { type, usedProjects, usedTables, usedDatasets } = this.props;

    return {
      [PermissionsListItemType.PROJECT]: usedProjects,
      [PermissionsListItemType.TABLE]: usedTables,
      [PermissionsListItemType.DATASET]: usedDatasets
    }[type];
  }

  @computed
  private get allSelected(): boolean {
    return (
      this.availableItems.length > 0 && this.selectedItems.length === this.availableItems.length - this.usedItems.length
    );
  }

  @boundMethod
  private add() {
    const { principalId, principalType, onAdd } = this.props;

    onAdd(
      [...this.selectedItems].map(item => ({
        entity: item,
        permissions: [{ principalId, principalType, role: this.role }]
      }))
    );

    this.close();
  }

  @action.bound
  private close() {
    this.selectedItems = [];
    this.role = Role.VIEWER;

    this.props.onClose();
  }

  @action.bound
  private handleSelectAll() {
    this.selectedItems = this.allSelected
      ? []
      : ([...this.availableItems].filter(item => !this.isAlreadyUsed(item)) as CrgProject[] | DataTable[] | Dataset[]);
  }

  @action.bound
  private handleRoleChange(e: React.ChangeEvent<{ name?: string; value: Role }>) {
    this.role = e.target.value;
  }

  @boundMethod
  private renderCheckbox(item: CrgProject | DataTable | Dataset): ReactNode {
    const { type } = this.props;
    let selected: boolean;
    const alreadyUsed = this.isAlreadyUsed(item);

    if (type === PermissionsListItemType.PROJECT) {
      const { id } = item as CrgProject;
      selected = alreadyUsed || (this.selectedItems as CrgProject[]).some(project => project.id === id);
    }
    if (type === PermissionsListItemType.TABLE) {
      selected =
        alreadyUsed || (this.selectedItems as DataTable[]).some(table => tablesEqual(table, item as DataTable));
    }
    if (type === PermissionsListItemType.DATASET) {
      const { identifier } = item as Dataset;
      selected = alreadyUsed || (this.selectedItems as Dataset[]).some(dataset => dataset.identifier === identifier);
    }

    return (
      <PermissionsAddDialogItemCheck
        item={item}
        checked={selected}
        disabled={alreadyUsed}
        onChange={this.handleCheck}
      />
    );
  }

  private isAlreadyUsed(item: CrgProject | DataTable | Dataset): boolean {
    const { type, usedProjects, usedTables, usedDatasets } = this.props;
    if (type === PermissionsListItemType.PROJECT) {
      const { id } = item as CrgProject;
      return usedProjects.some(usedProject => usedProject.id === id);
    }
    if (type === PermissionsListItemType.TABLE) {
      return usedTables.some(usedTable => tablesEqual(item as DataTable, usedTable));
    }
    if (type === PermissionsListItemType.DATASET) {
      const { identifier } = item as Dataset;
      return usedDatasets.some(usedDataset => usedDataset.identifier === identifier);
    }
  }

  @action.bound
  private handleCheck(item: CrgProject | DataTable | Dataset, checked: boolean) {
    if (checked) {
      (this.selectedItems as typeof item[]).push(item);
    } else {
      this.selectedItems.splice((this.selectedItems as typeof item[]).indexOf(item), 1);
    }
  }
}
