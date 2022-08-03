import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { PermissionsListItem } from '../../../services/data/allPermissions.service';
import { PrincipalType } from '../../../services/data/permissions.models';
import { Dataset, VectorTable } from '../../../services/data/data.service';
import { CrgProject } from '../../../services/gis/projects.models';
import { PermissionsAddDialog } from '../../PermissionsAddDialog/PermissionsAddDialog';

import { PermissionsListItemType } from '../PermissionsListDialog.models';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-Add.scss';

const cnPermissionsListDialogAdd = cn('PermissionsListDialog', 'Add');

interface PermissionsListDialogAddProps {
  usedProjects: CrgProject[];
  usedTables: VectorTable[];
  usedDatasets: Dataset[];
  principalId: number;
  principalType: PrincipalType;
  onAdd: (item: PermissionsListItem[]) => void;
  type: PermissionsListItemType;
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
