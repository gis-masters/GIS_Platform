import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { http } from '../../services/api/http.service';
import { LoginForm } from '../LoginForm/LoginForm';

import '!style-loader!css-loader!sass-loader!./LoginFormDialog.scss';

const cnLoginFormDialog = cn('LoginFormDialog');

export const LoginFormDialog: FC = observer(() => (
  <Dialog
    className={cnLoginFormDialog()}
    open={http.waitingForAuth && location.pathname !== '/photo'}
    fullWidth
    maxWidth='sm'
  >
    <DialogContent className={cnLoginFormDialog('Content')}>
      <LoginForm inDialog />
    </DialogContent>
  </Dialog>
));
