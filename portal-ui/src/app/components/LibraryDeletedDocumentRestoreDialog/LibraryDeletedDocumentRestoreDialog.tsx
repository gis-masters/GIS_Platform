import React, { Component } from 'react';
import { observable, makeObservable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { DriveFileMoveOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { recoverLibraryRecord } from '../../services/data/library/library.service';
import { Library, LibraryRecord } from '../../services/data/library/library.models';
import { ExplorerItemData, ExplorerItemType, emptyItem } from '../Explorer/Explorer.models';
import { isRecordUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { CommonDiRegistry } from '../../services/di-registry';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./LibraryDeletedDocumentRestoreDialog.scss';

const cnLibraryDeletedDocumentRestoreDialog = cn('LibraryDeletedDocumentRestoreDialog');

interface LibraryDeletedDocumentRestoreDialogProps {
  document: LibraryRecord;
  open: boolean;
  onClose: () => void;
  parentFolderPath?: ExplorerItemData[];
  currentLibrary?: Library;
}

@observer
export class LibraryDeletedDocumentRestoreDialog extends Component<LibraryDeletedDocumentRestoreDialogProps> {
  @observable private loading = false;
  @observable private disabled = true;
  @observable private selectedFolder?: LibraryRecord;

  constructor(props: LibraryDeletedDocumentRestoreDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const selectButton = (
      <Button
        children='Выбрать'
        onClick={this.submitFolderSelection}
        color='primary'
        startIcon={<DriveFileMoveOutlined />}
        loading={this.loading}
        disabled={this.disabled}
      />
    );
    const { parentFolderPath, open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} className={cnLibraryDeletedDocumentRestoreDialog()}>
        <DialogTitle>
          Выберите папку для восстановления документа
          <div className={cnLibraryDeletedDocumentRestoreDialog('Subtitle')}>
            (восстановление возможно только в папку с доступом на редактирование)
          </div>
        </DialogTitle>
        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ Explorer }: CommonDiRegistry) => (
              <Explorer
                explorerRole='DeletedDocuments'
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
              <Tooltip title={parentFolderPath ? 'Недостаточно прав' : ''}>
                <span>{selectButton}</span>
              </Tooltip>
            ) : (
              selectButton
            )}
            <Button onClick={onClose}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    return (
      this.props.parentFolderPath || [{ type: ExplorerItemType.LIBRARY, payload: this.props.currentLibrary }, emptyItem]
    );
  }

  @boundMethod
  private async handleSelect(item: ExplorerItemData<LibraryRecord>) {
    this.setSelectedFolder(item.payload);

    if (item.type === ExplorerItemType.NONE) {
      this.setDisabled(true);
    }

    if (this.selectedFolder?.is_folder) {
      this.setDisabled(!(await isRecordUpdateAllowed(this.selectedFolder)));
    }
  }

  @boundMethod
  private async submitFolderSelection() {
    this.setLoading(true);

    try {
      await recoverLibraryRecord(
        this.props.document,
        this.selectedFolder?.is_folder ? this.selectedFolder.id : undefined
      );
    } catch (error) {
      const err = error as AxiosError<{ message?: string[] }>;

      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      }
    }

    this.setLoading(false);
    this.props.onClose();
  }

  @boundMethod
  private async testForDisabled(item: ExplorerItemData<LibraryRecord>): Promise<boolean> {
    if (item.type === ExplorerItemType.FOLDER) {
      const allowed = await isRecordUpdateAllowed(item.payload);

      return !allowed;
    }

    return item.type === ExplorerItemType.DOCUMENT;
  }

  @action.bound
  private setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  @action.bound
  private setSelectedFolder(selectedFolder: LibraryRecord) {
    this.selectedFolder = selectedFolder;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
