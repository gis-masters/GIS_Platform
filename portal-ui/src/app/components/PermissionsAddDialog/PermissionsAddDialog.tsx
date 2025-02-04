import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Dialog, DialogActions, DialogContent, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { tablesEqual } from '../../services/data/vectorData/vectorData.util';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { PermissionsListItem, PrincipalType, Role, rolesTitles } from '../../services/permissions/permissions.models';
import { getRolesByPermissionsListItemType } from '../../services/permissions/permissions.utils';
import { allDataEntitiesStore } from '../../stores/AllDataEntities.store';
import { allProjects } from '../../stores/AllProjects.store';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import {
  baseXTablePropsSet,
  PermissionsListItemType,
  PermissionsXTablePropsSet
} from '../PermissionsListDialog/PermissionsListDialog.models';
import { XTable } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { PermissionsAddDialogItemCheck } from './ItemCheck/PermissionsAddDialog-ItemCheck';

import '!style-loader!css-loader!sass-loader!./Paper/PermissionsAddDialog-Paper.scss';

const cnPermissionsAddDialog = cn('PermissionsAddDialog');

interface PermissionsAddDialogProps {
  usedProjects: CrgProject[];
  usedTables: VectorTable[];
  usedDatasets: Dataset[];
  principalId: number;
  principalType: PrincipalType;
  open: boolean;
  type: PermissionsListItemType;
  onClose(): void;
  onAdd(item: PermissionsListItem[]): void;
}

@observer
export class PermissionsAddDialog extends Component<PermissionsAddDialogProps> {
  @observable selectedItems: CrgProject[] | VectorTable[] | Dataset[] = [];
  @observable role: Role = Role.VIEWER;

  constructor(props: PermissionsAddDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, type } = this.props;

    /* eslint-disable @typescript-eslint/no-explicit-any -- FIXME не удаётся вывести тип для xTable */
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
          <ActionsRight>
            <Select value={this.role} onChange={this.handleRoleChange} variant='standard'>
              {getRolesByPermissionsListItemType(type).map(roleName => (
                <MenuItem value={roleName} key={roleName}>
                  {rolesTitles[roleName]}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={this.add} color='primary' disabled={!this.selectedItems.length}>
              Добавить
            </Button>
            <Button onClick={this.close}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get checkboxCol(): XTableColumn<any> {
    return {
      title: (
        <Checkbox
          indeterminate={this.selectedItems.length > 0 && !this.allSelected}
          checked={this.allSelected}
          onChange={this.handleSelectAll}
        />
      ),
      cellProps: { padding: 'checkbox' },
      CellContent: this.renderCheckbox
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

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
  private get availableItems(): CrgProject[] | VectorTable[] | Dataset[] {
    return {
      [PermissionsListItemType.PROJECT]: allProjects.list,
      [PermissionsListItemType.TABLE]: allDataEntitiesStore.vectorTables,
      [PermissionsListItemType.DATASET]: allDataEntitiesStore.datasets
    }[this.props.type];
  }

  @computed
  private get usedItems(): CrgProject[] | VectorTable[] | Dataset[] {
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
      : ([...this.availableItems].filter(item => !this.isAlreadyUsed(item)) as
          | CrgProject[]
          | VectorTable[]
          | Dataset[]);
  }

  @action.bound
  private handleRoleChange(e: SelectChangeEvent<Role>) {
    this.role = e.target.value as Role;
  }

  @boundMethod
  private renderCheckbox({ rowData }: { rowData: CrgProject | VectorTable | Dataset }): ReactElement {
    const { type } = this.props;
    let selected: boolean = false;
    const alreadyUsed = this.isAlreadyUsed(rowData);

    if (type === PermissionsListItemType.PROJECT) {
      const { id } = rowData as CrgProject;
      selected = alreadyUsed || (this.selectedItems as CrgProject[]).some(project => project.id === id);
    }
    if (type === PermissionsListItemType.TABLE) {
      selected =
        alreadyUsed || (this.selectedItems as VectorTable[]).some(table => tablesEqual(table, rowData as VectorTable));
    }
    if (type === PermissionsListItemType.DATASET) {
      const { identifier } = rowData as Dataset;
      selected = alreadyUsed || (this.selectedItems as Dataset[]).some(dataset => dataset.identifier === identifier);
    }

    return (
      <PermissionsAddDialogItemCheck
        item={rowData}
        checked={selected}
        disabled={alreadyUsed}
        onChange={this.handleCheck}
      />
    );
  }

  private isAlreadyUsed(item: CrgProject | VectorTable | Dataset): boolean {
    const { type, usedProjects, usedTables, usedDatasets } = this.props;
    if (type === PermissionsListItemType.PROJECT) {
      const { id } = item as CrgProject;

      return usedProjects.some(usedProject => usedProject.id === id);
    }
    if (type === PermissionsListItemType.TABLE) {
      return usedTables.some(usedTable => tablesEqual(item as VectorTable, usedTable));
    }
    if (type === PermissionsListItemType.DATASET) {
      const { identifier } = item as Dataset;

      return usedDatasets.some(usedDataset => usedDataset.identifier === identifier);
    }

    return false;
  }

  @action.bound
  private handleCheck(item: CrgProject | VectorTable | Dataset, checked: boolean) {
    if (checked) {
      (this.selectedItems as (typeof item)[]).push(item);
    } else {
      this.selectedItems.splice((this.selectedItems as (typeof item)[]).indexOf(item), 1);
    }
  }
}
