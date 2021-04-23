import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

import { PermissionsListItem } from '../../../services/crg/allPermissions.service';
import { PrincipalType } from '../../../services/crg/permissions.models';
import { Dataset, DataTable } from '../../../services/data.service';
import { CrgProject } from '../../../services/crg/projects.models';
import { PermissionsAddDialog } from '../../PermissionsAddDialog/PermissionsAddDialog';

import { PermissionsListItemType } from '../PermissionsListDialog.models';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-Add.scss';

const cnPermissionsListDialogAdd = cn('PermissionsListDialog', 'Add');

interface PermissionsListDialogAddProps {
  usedProjects: CrgProject[];
  usedTables: DataTable[];
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
