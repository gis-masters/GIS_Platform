import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';

import { LayerAdd } from '../../Icons/LayerAdd';
import { IconButton } from '../../IconButton/IconButton';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { FileInfo } from '../../../services/data/files.service';
import { ProjectPlacementDialog } from '../../ProjectPlacementDialog/ProjectPlacementDialog';

const cnFilesPlacement = cn('Files', 'Placement');

interface PlacementProps {
  fileInfo: FileInfo;
}

@observer
export class FilesPlacement extends Component<PlacementProps> {
  @observable private dialogOpen = false;

  constructor(props: PlacementProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { fileInfo } = this.props;

    return (
      <>
        <Tooltip title='Разместить в проекте'>
          <IconButton className={cnFilesPlacement()} onClick={this.placementHandler} size='small'>
            {this.dialogOpen ? <LayerAdd fontSize='small' /> : <LayerAddOutlined fontSize='small' />}
          </IconButton>
        </Tooltip>

        <ProjectPlacementDialog fileInfo={fileInfo} open={this.dialogOpen} onClose={this.onClose} />
      </>
    );
  }

  @boundMethod
  private placementHandler() {
    this.openDialog();
  }

  @boundMethod
  private onClose() {
    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
