import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { StickyNote2Outlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MessagesRegistriesMessages } from '../../../services/data/messagesRegistries/messagesRegistries.models';
import { Schema } from '../../../services/data/schema/schema.models';
import { IconButton } from '../../IconButton/IconButton';
import { MessagesRegistryDialog } from '../../MessagesRegistryDialog/MessagesRegistryDialog';

const cnMessagesRegistryOpenAction = cn('MessagesRegistry', 'OpenAction');

interface MessagesRegistryOpenActionProps {
  message: MessagesRegistriesMessages;
  schema: Schema;
}

@observer
export class MessagesRegistryOpenAction extends Component<MessagesRegistryOpenActionProps> {
  @observable private dialogOpen = false;

  constructor(props: MessagesRegistryOpenActionProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { message, schema } = this.props;

    return (
      <>
        <IconButton className={cnMessagesRegistryOpenAction()} onClick={this.openDialog} size='small'>
          <Tooltip title='Открыть'>
            <StickyNote2Outlined color='primary' />
          </Tooltip>
        </IconButton>

        <MessagesRegistryDialog
          dialogOpen={this.dialogOpen}
          onClose={this.closeDialog}
          schema={schema}
          message={message}
        />
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
