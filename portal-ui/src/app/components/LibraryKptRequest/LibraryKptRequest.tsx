import React, { Component } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { ForwardToInbox } from '@mui/icons-material';
import { action, makeObservable, observable } from 'mobx';

import { Library } from '../../services/data/library/library.models';
import { IconButton } from '../IconButton/IconButton';

const cnLibraryKptRequest = cn('LibraryKptRequest');

interface LibraryKptRequestProps {
  library: Library;
}

@observer
export class LibraryKptRequest extends Component<LibraryKptRequestProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryKptRequestProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { library } = this.props;

    return (
      library.table_name === 'dl_data_kpt' && (
        <Tooltip title={'Заказ КПТ'}>
          <IconButton className={cnLibraryKptRequest()}>
            <ForwardToInbox fontSize='medium' color='inherit' />
          </IconButton>
        </Tooltip>
      )
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
