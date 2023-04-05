import React, { Component } from 'react';
import { http } from '../../services/api/http.service';
import { observer } from 'mobx-react';
import { Dialog, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { LoginForm } from '../LoginForm/LoginForm';

const cnLoginFormDialog = cn('LoginFormDialog');

import '!style-loader!css-loader!sass-loader!./LoginFormDialog.scss';

@observer
export class LoginFormDialog extends Component {
  render() {
    return (
      <Dialog className={cnLoginFormDialog()} open={http.waitingForAuth} fullWidth maxWidth='sm'>
        <DialogContent className={cnLoginFormDialog('Content')}>
          <LoginForm inDialog />
        </DialogContent>
      </Dialog>
    );
  }
}
