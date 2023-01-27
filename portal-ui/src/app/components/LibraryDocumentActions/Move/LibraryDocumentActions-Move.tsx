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
import { isRecordUpdateAllowed } from '../../../services/data/permissions.service';
import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { Button } from '../../Button/Button';

const cnLibraryDocumentActionsMove = cn('LibraryDocumentActions', 'Move');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  schema: Schema;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsMove extends Component<LibraryDocumentActionsFilesPlacementProps> {
  @observable private documentMoveDialogOpen = false;
  @observable private disabled = true;
  @observable private currentLibrary?: DocumentLibrary;
  @observable private selectedFolder?: LibraryRecord;

  constructor(props: LibraryDocumentActionsFilesPlacementProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const library = await getLibrary(this.props.document?.libraryId);
    this.setCurrentLibrary(library);
  }

  render() {
    const { as } = this.props;

    const moveButton = (
      <Button
        children='Выбрать'
        onClick={this.submitFolderSelection}
        color='primary'
        startIcon={<DriveFileMoveOutlined />}
        disabled={this.disabled}
      />
    );

    return (
      <>
        <ActionsItem
          title='Переместить'
          className={cnLibraryDocumentActionsMove()}
          icon={this.documentMoveDialogOpen ? <DriveFileMove /> : <DriveFileMoveOutlined />}
          onClick={this.openDocumentMoveDialog}
          as={as}
        />

        <Dialog open={this.documentMoveDialogOpen} onClose={this.closeDocumentMoveDialog}>
          <DialogTitle>Укажите папку для перемещения</DialogTitle>
          <DialogContent className='scroll'>
            <RegistryConsumer id='common'>
              {({ Explorer }: CommonDiRegistry) => (
                <Explorer
                  id='DocumentMove'
                  path={this.path}
                  onSelect={this.handleSelect}
                  disabledTester={this.testForDisabled}
                  customFilters={{
                    [ExplorerItemType.LIBRARY]: { is_folder: { $in: [true] } }
                  }}
                />
              )}
            </RegistryConsumer>
          </DialogContent>
          <DialogActions>
            <ActionsRight>
              {this.disabled ? (
                <Tooltip title={this.selectedFolder?.id ? 'Недостаточно прав для перемещения' : ''}>
                  <span>{moveButton}</span>
                </Tooltip>
              ) : (
                moveButton
              )}
              <Button onClick={this.closeDocumentMoveDialog}>Отмена</Button>
            </ActionsRight>
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
  private async handleSelect(item: ExplorerItemData<LibraryRecord>) {
    this.setSelectedFolder(item.payload);
    if (this.selectedFolder?.is_folder) {
      this.setDisabled(!(await isRecordUpdateAllowed(this.selectedFolder)));
    }

    if (!this.selectedFolder?.is_folder && !this.selectedFolder.loading) {
      this.setDisabled(true);
    }
  }

  @boundMethod
  private async submitFolderSelection() {
    await moveLibraryRecord(this.props.document, this.selectedFolder?.is_folder ? this.selectedFolder.id : null);

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
  private setSelectedFolder(selectedFolder: LibraryRecord) {
    this.selectedFolder = selectedFolder;
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
