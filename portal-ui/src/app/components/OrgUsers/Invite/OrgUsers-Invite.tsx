import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ContactMail, ContactMailOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';
import { OrgUsersInviteDialog } from '../../OrgUsersInviteDialog/OrgUsersInviteDialog';

const cnOrgUsersInvite = cn('OrgUsers', 'Invite');

@observer
export class OrgUsersInvite extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Button
          className={cnOrgUsersInvite()}
          startIcon={this.dialogOpen ? <ContactMail /> : <ContactMailOutlined />}
          onClick={this.openDialog}
          variant='text'
        >
          Пригласить пользователя
        </Button>
        <OrgUsersInviteDialog open={this.dialogOpen} onClose={this.closeDialog} />
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
