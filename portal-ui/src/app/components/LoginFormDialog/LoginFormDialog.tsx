import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { LoginForm } from '../LoginForm/LoginForm';
import { communicationService } from '../../services/communication.service';

const cnLoginFormDialog = cn('LoginFormDialog');

import '!style-loader!css-loader!sass-loader!./LoginFormDialog.scss';

@observer
export class LoginFormDialog extends Component {
  @observable private open: boolean;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    communicationService.authDialogOpen.on(() => this.setOpen(true), this);
    communicationService.authDialogSuccess.on(() => this.setOpen(false), this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    return (
      <Dialog className={cnLoginFormDialog()} open={this.open || false} fullWidth maxWidth='sm'>
        <DialogContent className={cnLoginFormDialog('Content')}>
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
