import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent } from '@material-ui/core';

import { LoginForm } from '../LoginForm/LoginForm';
import { communicationService } from '../../services/communication.service';

@observer
export class LoginFormDialog extends Component {
  @observable private open: boolean;

  componentDidMount() {
    communicationService.authDialogOpen.on(() => this.setOpen(true), this);
    communicationService.authDialogSuccess.on(() => this.setOpen(false), this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    return (
      <Dialog open={this.open || false} fullWidth maxWidth='sm'>
        <DialogContent>
          <LoginForm inDialog />
        </DialogContent>
      </Dialog>
    );
  }

  @action.bound
  private setOpen(isDialogOpen: boolean): void {
    this.open = isDialogOpen;
  }
}
