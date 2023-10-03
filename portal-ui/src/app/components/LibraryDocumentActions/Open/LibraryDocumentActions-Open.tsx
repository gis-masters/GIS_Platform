import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { LibraryRecord } from '../../../services/data/library/library.models';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentActionsOpen = cn('LibraryDocumentActions', 'Open');

interface LibraryDocumentActionsOpenProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  deletedDocument?: boolean;
}

@observer
export class LibraryDocumentActionsOpen extends Component<LibraryDocumentActionsOpenProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryDocumentActionsOpenProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document, deletedDocument } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsOpen()}
          title='Открыть'
          as={as}
          url={`/data-management/library/${document.libraryTableName}/document/${document.id}`}
          icon={<FileOpenOutlined />}
          onClick={this.openDialog}
        />

        <LibraryDocumentDialog
          deletedDocument={deletedDocument}
          document={document}
          open={this.dialogOpen}
          onClose={this.closeDialog}
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
