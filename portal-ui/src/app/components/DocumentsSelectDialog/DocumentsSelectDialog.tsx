import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { StorageOutlined, TableViewOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { CommonDiRegistry } from '../../services/di-registry';
import { DocumentLibrary, getLibrary, LibraryRecord } from '../../services/data/doc-library.service';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { DocumentInfo } from '../Documents/Documents';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./DocumentsSelectDialog.scss';

const cnDocumentsSelectDialog = cn('DocumentsSelectDialog');

interface DocumentsSelectDialogProps {
  addedDocuments: DocumentInfo[];
  maxDocuments: number;
  dialogOpen: boolean;
  librariesIdentifiers?: string[];
  onChange(selectedItems: DocumentInfo[]): void;
  onClose: () => void;
}

@observer
export class DocumentsSelectDialog extends Component<DocumentsSelectDialogProps> {
  @observable private selectedDocuments?: LibraryRecord[] = [];
  @observable private libraryView = false;
  @observable private error = false;
  @observable private limitingLibrary?: DocumentLibrary;
  @observable private selectedItem?: ExplorerItemData[];
  private limitingLibraryRequest?: Promise<DocumentLibrary>;

  constructor(props: DocumentsSelectDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidUpdate(prevProps: DocumentsSelectDialogProps) {
    if (!this.limitingLibraryRequest && !prevProps.dialogOpen && this.props.dialogOpen) {
      await this.handleDialogOpen();
    }
  }

  render() {
    const { maxDocuments, dialogOpen, addedDocuments, librariesIdentifiers } = this.props;

    return (
      <Dialog
        className={cnDocumentsSelectDialog()}
        open={dialogOpen}
        onClose={this.closeDialog}
        maxWidth={this.libraryView ? 'xl' : 'md'}
      >
        <DialogTitle>Выберите документ</DialogTitle>

        {(this.limitingLibrary || this.showRegistryBtn) && (
          <div className={cnDocumentsSelectDialog('Switcher')}>
            <Tooltip title={this.libraryView ? 'Вложенный список документов' : 'Таблица документов'}>
              <IconButton onClick={this.toggleRegisterView}>
                {this.libraryView ? <StorageOutlined /> : <TableViewOutlined />}
              </IconButton>
            </Tooltip>
          </div>
        )}

        <DialogContent>
          {!this.libraryView ? (
            this.ready && (
              <RegistryConsumer id='common'>
                {({ Explorer }: CommonDiRegistry) => (
                  <Explorer
                    id='DocumentsSelectDialog'
                    className={cnDocumentsSelectDialog('Explorer')}
                    path={this.path}
                    onSelect={this.handleSelect}
                    onOpen={this.handleOpen}
                    customFilters={
                      librariesIdentifiers.length > 1
                        ? {
                            [ExplorerItemType.LIBRARY_ROOT]: { identifier: { $in: librariesIdentifiers } }
                          }
                        : undefined
                    }
                    disabledTester={this.testForDisabled}
                  />
                )}
              </RegistryConsumer>
            )
          ) : (
            <RegistryConsumer id='common'>
              {({ LibraryRegistry }: CommonDiRegistry) => (
                <LibraryRegistry
                  id='DocumentsAdd'
                  onSelect={this.handleMultipleSelect}
                  checkedLibraryDocuments={this.selectedDocuments || []}
                  libraryId={
                    this.limitingLibrary?.identifier || (this.selectedItem[1].payload as DocumentLibrary).identifier
                  }
                  addedDocuments={addedDocuments}
                  inDialog
                />
              )}
            </RegistryConsumer>
          )}
        </DialogContent>
        <DialogActions>
          {this.error && (
            <div className={cnDocumentsSelectDialog('Error')}>
              Превышено максимальное число выбираемых файлов: {this.selectedDocuments?.length + addedDocuments.length}{' '}
              из {maxDocuments}
            </div>
          )}
          <Button color='primary' disabled={!this.selectedDocuments || this.error} onClick={this.submitDialog}>
            Выбрать
          </Button>
          <Button onClick={this.closeDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get ready(): boolean {
    return !!this.limitingLibrary || this.props.librariesIdentifiers.length !== 1;
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    return this.limitingLibrary
      ? [{ type: ExplorerItemType.LIBRARY, payload: this.limitingLibrary }, emptyItem]
      : [{ type: ExplorerItemType.LIBRARY_ROOT, payload: null }, emptyItem];
  }

  @boundMethod
  private handleSelect(item: ExplorerItemData<LibraryRecord>) {
    if (
      (item.type === ExplorerItemType.DOCUMENT || item.type === ExplorerItemType.FOLDER) &&
      !this.testForDisabled(item)
    ) {
      this.select([item.payload]);
    } else {
      this.select();
    }
  }

  @boundMethod
  private handleMultipleSelect(items: LibraryRecord[]) {
    this.select(items);
    const { maxDocuments, addedDocuments } = this.props;

    if (maxDocuments && this.selectedDocuments.length + addedDocuments.length > maxDocuments) {
      this.setError(true);
    } else {
      this.setError(false);
    }
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    this.setSelectedItem(path);

    if (item.type === ExplorerItemType.DOCUMENT) {
      this.handleSelect(item);
      this.submitDialog();
    }
  }

  @computed
  private get showRegistryBtn(): boolean {
    return this.selectedItem?.some(item => item.type === ExplorerItemType.LIBRARY);
  }

  @action
  private setSelectedItem(selectedItem: ExplorerItemData[]) {
    this.selectedItem = selectedItem;
  }

  @action
  private select(libraryRecord: LibraryRecord[] = []) {
    this.selectedDocuments = libraryRecord;
  }

  @action.bound
  private toggleRegisterView() {
    this.libraryView = !this.libraryView;
  }

  @action.bound
  private setError(error: boolean) {
    this.error = error;
  }

  @action.bound
  private submitDialog() {
    this.props.onClose();

    this.props.onChange(
      this.selectedDocuments.map(item => {
        return {
          id: item.id,
          title: item.title,
          libraryId: item.libraryId
        };
      })
    );

    this.selectedDocuments = [];
  }

  @boundMethod
  private closeDialog() {
    this.props.onClose();
    this.select(null);
  }

  @boundMethod
  private testForDisabled({ payload, type }: ExplorerItemData<LibraryRecord>): boolean {
    const { addedDocuments } = this.props;

    if (type === ExplorerItemType.DOCUMENT) {
      return addedDocuments.some(({ libraryId, id }) => payload.libraryId === libraryId && payload.id === id);
    }

    return false;
  }

  @boundMethod
  private async handleDialogOpen() {
    const { librariesIdentifiers } = this.props;

    if (!this.limitingLibraryRequest && librariesIdentifiers.length === 1) {
      try {
        this.limitingLibraryRequest = getLibrary(librariesIdentifiers[0]);
        this.setLimitingLibrary(await this.limitingLibraryRequest);
      } catch (error) {
        const err = error as AxiosError;
        Toast.warn(`Ошибка доступа к библиотеке документов ${librariesIdentifiers[0]}. [${err.message}]`);

        return;
      }
    }

    if (!librariesIdentifiers.length) {
      this.setLimitingLibrary();
    }
  }

  @action
  private setLimitingLibrary(library?: DocumentLibrary) {
    this.limitingLibrary = library;
  }
}
