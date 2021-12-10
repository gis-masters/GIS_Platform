import React, { Component, ComponentType } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/crg/doc-library.service';

import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';
import { LibraryDocumentActionsProps } from '../LibraryDocumentActions';
import { LibraryDocumentProps } from '../../LibraryDocument/LibraryDocument';

const cnLibraryDocumentActionsOpen = cn('LibraryDocumentActions', 'Open');

interface LibraryDocumentActionsOpenProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  LibraryDocumentActions: ComponentType<LibraryDocumentActionsProps>;
  LibraryDocument: ComponentType<LibraryDocumentProps>;
}

@observer
export class LibraryDocumentActionsOpen extends Component<LibraryDocumentActionsOpenProps> {
  @observable private dialogOpen = false;

  render() {
    const { as, document, LibraryDocumentActions, LibraryDocument } = this.props;

    if (!LibraryDocumentActions || !LibraryDocument) {
      return null;
    }

    return (
      <>
        <LibraryDocumentActionsItem
          className={cnLibraryDocumentActionsOpen()}
          title='Открыть'
          as={as}
          url={`/data-management/library/${document.libraryId}/document/${document.id}`}
          icon={<FileOpenOutlined />}
          onClick={this.openDialog}
        />

        <Dialog open={this.dialogOpen} onClose={this.closeDialog} fullWidth maxWidth='xl'>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogContent>
            <LibraryDocument document={document} contentOnly />
          </DialogContent>
          <DialogActions>
            <LibraryDocumentActions
              document={document}
              as='button'
              hideOpen
              forDialog
              onDialogClose={this.closeDialog}
            />
          </DialogActions>
        </Dialog>
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
