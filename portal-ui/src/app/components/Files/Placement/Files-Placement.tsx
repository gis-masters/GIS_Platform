import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { FileInfo } from '../../../services/data/files/files.models';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { IconButton } from '../../IconButton/IconButton';
import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { ProjectPlacementDialog } from '../../ProjectPlacementDialog/ProjectPlacementDialog';

const cnFilesPlacement = cn('Files', 'Placement');

interface PlacementProps {
  fileInfo: FileInfo;
  document?: LibraryRecord;
}

@observer
export class FilesPlacement extends Component<PlacementProps> {
  @observable private dialogOpen = false;

  constructor(props: PlacementProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { fileInfo, document } = this.props;

    return (
      <>
        <Tooltip title='Разместить в проекте'>
          <span>
            <IconButton className={cnFilesPlacement()} onClick={this.handlePlacement} size='small'>
              {this.dialogOpen ? <LayerAdd fontSize='small' /> : <LayerAddOutlined fontSize='small' />}
            </IconButton>
          </span>
        </Tooltip>

        <ProjectPlacementDialog
          maxWidth={'md'}
          fullWidth
          document={document}
          fileInfo={fileInfo}
          open={this.dialogOpen}
          onClose={this.onClose}
        />
      </>
    );
  }

  @boundMethod
  private handlePlacement() {
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
