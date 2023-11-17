import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibrarySearchItemActionsOpen = cn('LibrarySearchItemActions', 'Open');

interface LibrarySearchItemActionsOpenProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibrarySearchItemActionsOpen extends Component<LibrarySearchItemActionsOpenProps> {
  @observable private dialogOpen = false;

  constructor(props: LibrarySearchItemActionsOpenProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibrarySearchItemActionsOpen()}
          title='Открыть'
          as={as}
          icon={<FileOpenOutlined />}
          onClick={this.openDialog}
        />

        <LibraryDocumentDialog document={document} open={this.dialogOpen} onClose={this.closeDialog} />
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
