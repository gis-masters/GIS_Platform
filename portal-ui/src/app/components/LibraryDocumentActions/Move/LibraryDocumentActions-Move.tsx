import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DriveFileMove, DriveFileMoveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { getLibrary, moveLibraryRecord } from '../../../services/data/library/library.service';
import { Schema } from '../../../services/data/schema/schema.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { SelectFolderDialog } from '../../SelectFolderDialog/SelectFolderDialog';

const cnLibraryDocumentActionsMove = cn('LibraryDocumentActions', 'Move');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  schema?: Schema;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsMove extends Component<LibraryDocumentActionsFilesPlacementProps> {
  @observable private documentMoveDialogOpen = false;
  @observable private loading = false;
  @observable private currentLibrary?: Library;

  constructor(props: LibraryDocumentActionsFilesPlacementProps) {
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
          title='Переместить'
          className={cnLibraryDocumentActionsMove()}
          icon={this.documentMoveDialogOpen ? <DriveFileMove /> : <DriveFileMoveOutlined />}
          onClick={this.openDocumentMoveDialog}
          as={as}
        />

        <SelectFolderDialog
          document={document}
          title='Укажите папку для перемещения'
          startPath={
            this.currentLibrary
              ? ([{ type: ExplorerItemType.LIBRARY, payload: this.currentLibrary }, emptyItem] as ExplorerItemData[])
              : undefined
          }
          open={this.documentMoveDialogOpen}
          loading={this.loading}
          onClose={this.closeDocumentMoveDialog}
          onSelect={this.selectFolder}
        />
      </>
    );
  }

  @action.bound
  private async selectFolder(folder: LibraryRecord | null) {
    this.setLoading(true);
    await moveLibraryRecord(this.props.document, folder?.is_folder ? folder.id : undefined);
    this.setLoading(false);
    this.closeDocumentMoveDialog();
  }

  @action.bound
  private setCurrentLibrary(currentLibrary: Library) {
    this.currentLibrary = currentLibrary;
  }

  @action.bound
  private openDocumentMoveDialog() {
    this.documentMoveDialogOpen = true;
  }

  @action.bound
  private closeDocumentMoveDialog() {
    this.documentMoveDialogOpen = false;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
