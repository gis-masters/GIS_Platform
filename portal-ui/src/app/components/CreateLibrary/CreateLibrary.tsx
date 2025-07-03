import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { LibraryNew, librarySchema } from '../../services/data/library/library.models';
import { createLibrary } from '../../services/data/library/library.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';
import { LibraryAdd } from '../Icons/LibraryAdd';
import { LibraryAddOutlined } from '../Icons/LibraryAddOutlined';

const cnCreateLibrary = cn('CreateLibrary');

@observer
export class CreateLibrary extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать библиотеку'>
          <span>
            <IconButton className={cnCreateLibrary()} onClick={this.openDialog}>
              {this.dialogOpen ? <LibraryAdd /> : <LibraryAddOutlined />}
            </IconButton>
          </span>
        </Tooltip>
        <FormDialog<LibraryNew>
          title='Создание новой библиотеки'
          className={cnCreateLibrary('Form')}
          open={this.dialogOpen}
          schema={librarySchema}
          onClose={this.closeDialog}
          closeWithConfirm
          actionFunction={this.create}
          actionButtonProps={{ children: 'Создать' }}
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

  private async create(libraryNew: LibraryNew) {
    await createLibrary(libraryNew);
  }
}
