import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { action, observable, makeObservable, computed } from 'mobx';
import { DriveFileMove, DriveFileMoveOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { Schema } from '../../../services/data/schema.models';
import { CommonDiRegistry } from '../../../services/di-registry';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import {
  DocumentLibrary,
  getLibrary,
  LibraryRecord,
  moveLibraryRecord
} from '../../../services/data/doc-library.service';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { isLibraryUpdateAllowed, isRecordUpdateAllowed } from '../../../services/data/permissions.service';
import { Button } from '../../Button/Button';

const cnLibraryDocumentActionsFilesPlacement = cn('LibraryDocumentActions', 'FilesPlacement');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  schema: Schema;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsMove extends Component<LibraryDocumentActionsFilesPlacementProps> {
  @observable private documentMoveDialogOpen = false;
  @observable private disabled = false;
  @observable private currentLibrary?: DocumentLibrary;
  @observable private openedFolder?: LibraryRecord;

  constructor(props: LibraryDocumentActionsFilesPlacementProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const library = await getLibrary(this.props.document?.libraryId);
    this.setDisabled(!(await isLibraryUpdateAllowed(library)));
    this.setCurrentLibrary(library);
  }

  render() {
    const { as } = this.props;

    const moveButton = (
      <Button
        children='Переместить сюда'
        onClick={this.submitFolderSelection}
        color='primary'
        startIcon={<DriveFileMoveOutlined />}
        disabled={this.disabled}
      />
    );

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsFilesPlacement()}
          title='Переместить'
          icon={this.documentMoveDialogOpen ? <DriveFileMove /> : <DriveFileMoveOutlined />}
          onClick={this.openDocumentMoveDialog}
          as={as}
        />

        <Dialog open={this.documentMoveDialogOpen} onClose={this.closeDocumentMoveDialog}>
          <DialogTitle>Выбор проекта</DialogTitle>
          <DialogContent>
            <RegistryConsumer id='common'>
              {({ Explorer }: CommonDiRegistry) => (
                <Explorer
                  id='DocumentMove'
                  className={cnLibraryDocumentActionsFilesPlacement('Explorer')}
                  path={this.path}
                  onOpen={this.handleOpen}
                  disabledTester={this.testForDisabled}
                />
              )}
            </RegistryConsumer>
          </DialogContent>
          <DialogActions>
            {this.disabled ? (
              <Tooltip title='Недостаточно прав для перемещения'>
                <span>{moveButton}</span>
              </Tooltip>
            ) : (
              moveButton
            )}
            <Button onClick={this.closeDocumentMoveDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    return [{ type: ExplorerItemType.LIBRARY, payload: this.currentLibrary }, emptyItem];
  }

  @boundMethod
  private async handleOpen(item: ExplorerItemData<LibraryRecord>) {
    this.setOpenedFolder(item.payload);
    this.setDisabled(!(await isLibraryUpdateAllowed(this.currentLibrary)));

    if (this.openedFolder?.is_folder) {
      this.setDisabled(!(await isRecordUpdateAllowed(this.openedFolder)));
    }
  }

  @boundMethod
  private async submitFolderSelection() {
    await moveLibraryRecord(this.props.document, this.openedFolder?.is_folder ? this.openedFolder.id : null);

    this.closeDocumentMoveDialog();
  }

  @boundMethod
  private testForDisabled({ type }: ExplorerItemData<LibraryRecord>): boolean {
    return type === ExplorerItemType.DOCUMENT;
  }

  @action.bound
  private setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  @action.bound
  private setCurrentLibrary(currentLibrary: DocumentLibrary) {
    this.currentLibrary = currentLibrary;
  }

  @action.bound
  private setOpenedFolder(openedFolder: LibraryRecord) {
    this.openedFolder = openedFolder;
  }

  @action.bound
  private openDocumentMoveDialog() {
    this.documentMoveDialogOpen = true;
  }

  @action.bound
  private closeDocumentMoveDialog() {
    this.documentMoveDialogOpen = false;
  }
}
