import React, { Component } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import { RestorePageOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { getLibrary, getLibraryRecord } from '../../../services/data/library/library.service';
import { LibraryDeletedDocumentRestoreDialog } from '../../LibraryDeletedDocumentRestoreDialog/LibraryDeletedDocumentRestoreDialog';
import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';

const cnLibraryDeletedDocumentActionsRestore = cn('LibraryDeletedDocumentActions', 'Restore');

interface LibraryDeletedDocumentActionsRestoreProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDeletedDocumentActionsRestore extends Component<LibraryDeletedDocumentActionsRestoreProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;
  @observable private documentRestoreDialogOpen = false;
  @observable private currentLibrary?: Library;
  @observable private parentFolderPath?: ExplorerItemData[];

  constructor(props: LibraryDeletedDocumentActionsRestoreProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const library = await getLibrary(this.props.document?.libraryTableName);
    this.setCurrentLibrary(library);
  }

  render() {
    const { as, document } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDeletedDocumentActionsRestore()}
          title='Восстановить документ'
          as={as}
          onClick={this.restoreDocument}
          icon={<RestorePageOutlined />}
        />

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>
            Невозможно восстановить документ в изначальную папку. Выберите папку для восстановления.
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.openDocumentRestoreDialog} loading={this.loading} color='primary'>
              Выбрать
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>

        <LibraryDeletedDocumentRestoreDialog
          document={document}
          onClose={this.closeDocumentRestoreDialog}
          currentLibrary={this.currentLibrary}
          parentFolderPath={this.parentFolderPath}
          open={this.documentRestoreDialogOpen}
        />
      </>
    );
  }

  @boundMethod
  private async restoreDocument() {
    const pathParts = this.props.document.path.split('/');
    pathParts.shift();

    if (pathParts.length > 1) {
      const parent = await getLibraryRecord(this.props.document.libraryTableName, Number(pathParts.at(-1)));

      if (parent?.is_deleted) {
        this.openDialog();
      } else {
        const pathParts = this.props.document.path.split('/').slice(2);
        const parents = await Promise.all(
          pathParts.map(async part => {
            const folder = await getLibraryRecord(this.props.document.libraryTableName, Number(part));

            return { type: ExplorerItemType.FOLDER, payload: folder };
          })
        );

        this.setParentFolderPath([{ type: ExplorerItemType.LIBRARY, payload: this.currentLibrary }, ...parents]);

        this.openDocumentRestoreDialog();
      }
    } else {
      this.openDocumentRestoreDialog();
    }
  }

  @action.bound
  private setCurrentLibrary(currentLibrary: Library) {
    this.currentLibrary = currentLibrary;
  }

  @action.bound
  private setParentFolderPath(parentFolderPath: ExplorerItemData[]) {
    this.parentFolderPath = parentFolderPath;
  }

  @action.bound
  private openDocumentRestoreDialog() {
    this.closeDialog();
    this.documentRestoreDialogOpen = true;
  }

  @action.bound
  private closeDocumentRestoreDialog() {
    this.documentRestoreDialogOpen = false;
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
