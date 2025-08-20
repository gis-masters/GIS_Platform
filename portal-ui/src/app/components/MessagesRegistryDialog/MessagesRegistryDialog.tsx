import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MessagesRegistriesMessages } from '../../services/data/messagesRegistries/messagesRegistries.models';
import { Schema } from '../../services/data/schema/schema.models';
import { Button } from '../Button/Button';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./MessagesRegistryDialog.scss';

const cnMessagesRegistryDialog = cn('MessagesRegistryDialog');

interface MessagesRegistryDialogProps {
  dialogOpen: boolean;
  message: MessagesRegistriesMessages;
  schema: Schema;
  onClose(): void;
}

export const MessagesRegistryDialog: FC<MessagesRegistryDialogProps> = ({ dialogOpen, message, schema, onClose }) => (
  <Dialog open={dialogOpen} onClose={onClose} fullWidth maxWidth='xl'>
    <DialogTitle>
      <div className={cnMessagesRegistryDialog('TypeIcon')}>
        <EmailOutlined color='primary' />
      </div>
      Просмотр сообщения
    </DialogTitle>

    <DialogContent>
      <ViewContentWidget schema={schema} data={message} title='Карточка сообщения' />
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose}>Закрыть</Button>
    </DialogActions>
  </Dialog>
);
