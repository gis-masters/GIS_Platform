import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type Dataset, type VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { type CrgProject } from '../../../services/gis/projects/projects.models';
import { type PermissionsListItem, type PrincipalType } from '../../../services/permissions/permissions.models';
import { IconButton } from '../../IconButton/IconButton';
import { PermissionsAddDialog } from '../../PermissionsAddDialog/PermissionsAddDialog';
import { PermissionsListItemType } from '../PermissionsListDialog.models';

const cnPermissionsListDialogAdd = cn('PermissionsListDialog', 'Add');

interface PermissionsListDialogAddProps {
  usedProjects: CrgProject[];
  usedTables: VectorTable[];
  usedDatasets: Dataset[];
  principalId: number;
  principalType: PrincipalType;
  type: PermissionsListItemType;
  onAdd(item: PermissionsListItem[]): void;
}

const entityTypeLabels = {
  [PermissionsListItemType.PROJECT]: 'проект',
  [PermissionsListItemType.TABLE]: 'векторный слой',
  [PermissionsListItemType.DATASET]: 'набор данных'
};

@observer
export class PermissionsListDialogAdd extends Component<PermissionsListDialogAddProps> {
  @observable private open = false;

  constructor(props: PermissionsListDialogAddProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { usedProjects, usedDatasets, usedTables, principalId, principalType, onAdd, type } = this.props;

    return (
      <>
        <Tooltip title={`Добавить ${entityTypeLabels[type]}`}>
          <IconButton className={cnPermissionsListDialogAdd()} onClick={this.openDialog}>
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
        <PermissionsAddDialog
          open={this.open}
          onClose={this.closeDialog}
          onAdd={onAdd}
          usedProjects={usedProjects}
          usedTables={usedTables}
          usedDatasets={usedDatasets}
          principalId={principalId}
          principalType={principalType}
          type={type}
        />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private closeDialog() {
    this.open = false;
  }
}
