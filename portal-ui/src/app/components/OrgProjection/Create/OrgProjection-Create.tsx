import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CreateProjection } from '../../CreateProjection/CreateProjection';
import { IconButton } from '../../IconButton/IconButton';

const cnOrgProjectionCreate = cn('OrgProjection', 'Create');

@observer
export class OrgProjectionCreate extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать пользовательскую систему координат'>
          <IconButton className={cnOrgProjectionCreate()} size='small' onClick={this.openDialog}>
            <Add fontSize='small' />
          </IconButton>
        </Tooltip>

        <CreateProjection open={this.dialogOpen} onClose={this.closeDialog} />
      </>
    );
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
