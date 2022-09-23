import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { FileOpenOutlined } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';

import { CommonDiRegistry } from '../../../services/di-registry';
import { LibraryRecord } from '../../../services/data/doc-library.service';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentActionsOpen = cn('LibraryDocumentActions', 'Open');

interface LibraryDocumentActionsOpenProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsOpen extends Component<LibraryDocumentActionsOpenProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryDocumentActionsOpenProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsOpen()}
          title='Открыть'
          as={as}
          url={`/data-management/library/${document.libraryId}/document/${document.id}`}
          icon={<FileOpenOutlined />}
          onClick={this.openDialog}
        />

        <Dialog open={this.dialogOpen} onClose={this.closeDialog} fullWidth maxWidth='xl'>
          <RegistryConsumer id='common'>
            {({ LibraryDocument, LibraryDocumentActions }: CommonDiRegistry) => (
              <>
                <DialogContent className='scroll'>
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
              </>
            )}
          </RegistryConsumer>
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
