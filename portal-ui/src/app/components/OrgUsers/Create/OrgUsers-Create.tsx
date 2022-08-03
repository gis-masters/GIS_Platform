import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { PersonAdd, PersonAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';
import { OrgUsersCreateEditDialog } from '../../OrgUsersCreateEditDialog/OrgUsersCreateEditDialog';

const cnOrgUsersCreate = cn('OrgUsers', 'Create');

@observer
export class OrgUsersCreate extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Button
          className={cnOrgUsersCreate()}
          startIcon={this.dialogOpen ? <PersonAdd /> : <PersonAddOutlined />}
          onClick={this.openDialog}
          variant='text'
        >
          Создать пользователя
        </Button>
        <OrgUsersCreateEditDialog open={this.dialogOpen} onClose={this.closeDialog} create />
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
