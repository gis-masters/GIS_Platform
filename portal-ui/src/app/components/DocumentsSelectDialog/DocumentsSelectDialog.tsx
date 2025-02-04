import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { TableViewOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Library, LibraryRecord } from '../../services/data/library/library.models';
import { getLibrary } from '../../services/data/library/library.service';
import { CommonDiRegistry } from '../../services/di-registry';
import { Button } from '../Button/Button';
import { DocumentInfo } from '../Documents/Documents';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { ExplorerView } from '../Icons/ExplorerView';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./DocumentsSelectDialog.scss';

const cnDocumentsSelectDialog = cn('DocumentsSelectDialog');

interface DocumentsSelectDialogProps {
  addedDocuments: DocumentInfo[];
  maxDocuments?: number;
  dialogOpen: boolean;
  librariesTableNames?: string[];
  onChange(selectedItems: DocumentInfo[]): void;
  onClose(): void;
}

@observer
export class DocumentsSelectDialog extends Component<DocumentsSelectDialogProps> {
  @observable private selectedDocuments?: LibraryRecord[] = [];
  @observable private libraryView = false;
  @observable private error = false;
  @observable private limitingLibrary?: Library;
  @observable private selectedItem?: ExplorerItemData[];
  private limitingLibraryRequest?: Promise<Library>;

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
    const { maxDocuments, dialogOpen, addedDocuments, librariesTableNames } = this.props;

    return (
      <Dialog
        className={cnDocumentsSelectDialog()}
        open={dialogOpen}
        onClose={this.closeDialog}
        maxWidth={this.libraryView ? 'xl' : 'md'}
        fullWidth
      >
        <DialogTitle>Выберите документ</DialogTitle>

        {(this.limitingLibrary || this.showRegistryBtn) && (
          <div className={cnDocumentsSelectDialog('Switcher')}>
            <Tooltip title={this.libraryView ? 'Вложенный список документов' : 'Таблица документов'}>
              <IconButton onClick={this.toggleRegisterView}>
                {this.libraryView ? <ExplorerView /> : <TableViewOutlined />}
              </IconButton>
            </Tooltip>
          </div>
        )}

        <DialogContent>
          {this.libraryView && this.showRegistryBtn ? (
            <RegistryConsumer id='common'>
              {({ LibraryRegistry }: CommonDiRegistry) => (
                <LibraryRegistry
                  id='DocumentsAdd'
                  onSelect={this.handleMultipleSelect}
                  checkedLibraryDocuments={this.selectedDocuments || []}
                  libraryTableName={
                    this.limitingLibrary?.table_name || (this.selectedItem?.[1].payload as Library).table_name
                  }
                  addedDocuments={addedDocuments}
                  inDialog
                />
              )}
            </RegistryConsumer>
          ) : (
            this.ready && (
              <RegistryConsumer id='common'>
                {({ Explorer }: CommonDiRegistry) => (
                  <Explorer
                    explorerRole='DocumentsSelectDialog'
                    className={cnDocumentsSelectDialog('Explorer')}
                    path={this.path}
                    onSelect={this.handleSelect}
                    onOpen={this.handleOpen}
                    customFilters={
                      (librariesTableNames?.length || 0) > 1
                        ? {
                            [ExplorerItemType.LIBRARY_ROOT]: { table_name: { $in: librariesTableNames || [] } }
                          }
                        : undefined
                    }
                    disabledTester={this.testForDisabled}
                  />
                )}
              </RegistryConsumer>
            )
          )}
        </DialogContent>
        <DialogActions>
          {this.error && (
            <div className={cnDocumentsSelectDialog('Error')}>
              Превышено максимальное число выбираемых файлов:{' '}
              {(this.selectedDocuments || []).length + addedDocuments.length} из {maxDocuments}
            </div>
          )}
          <Button color='primary' disabled={!this.selectedDocuments?.length || this.error} onClick={this.submitDialog}>
            Выбрать
          </Button>
          <Button onClick={this.closeDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get ready(): boolean {
    return !!this.limitingLibrary || this.props.librariesTableNames?.length !== 1;
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    if (this.selectedItem) {
      return this.selectedItem;
    }

    return this.limitingLibrary
      ? [{ type: ExplorerItemType.LIBRARY, payload: this.limitingLibrary }, emptyItem]
      : [{ type: ExplorerItemType.LIBRARY_ROOT, payload: null }, emptyItem];
  }

  @boundMethod
  private handleSelect(item: ExplorerItemData) {
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

    if (maxDocuments && (this.selectedDocuments?.length || 0) + addedDocuments.length > maxDocuments) {
      this.setError(true);
    } else {
      this.setError(false);
    }
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData, path: ExplorerItemData[]) {
    this.setSelectedItem(path);

    if (item.type === ExplorerItemType.DOCUMENT) {
      this.handleSelect(item);
      this.submitDialog();
    }
  }

  @computed
  private get showRegistryBtn(): boolean {
    // если мы находимся внутри библиотеки то доступен переход в табличный вид
    return !!(this.path && this.path.some(item => item.type === 'lib'));
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
    this.select();

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
      this.selectedDocuments?.map(({ id, title, libraryTableName }) => {
        return { id, title, libraryTableName };
      }) || []
    );

    this.selectedDocuments = [];
  }

  @boundMethod
  private closeDialog() {
    this.props.onClose();
    this.select();
  }

  @boundMethod
  private testForDisabled({ payload, type }: ExplorerItemData): boolean {
    const { addedDocuments } = this.props;

    if (type === ExplorerItemType.DOCUMENT) {
      return addedDocuments.some(
        ({ libraryTableName, id }) => payload.libraryTableName === libraryTableName && payload.id === id
      );
    }

    return false;
  }

  @boundMethod
  private async handleDialogOpen() {
    const { librariesTableNames } = this.props;

    if (!this.limitingLibraryRequest && librariesTableNames?.length === 1) {
      try {
        this.limitingLibraryRequest = getLibrary(librariesTableNames[0]);
        this.setLimitingLibrary(await this.limitingLibraryRequest);
      } catch (error) {
        const err = error as AxiosError;
        Toast.warn(`Ошибка доступа к библиотеке документов ${librariesTableNames[0]}. [${err.message}]`);

        return;
      }
    }

    if (!librariesTableNames?.length) {
      this.setLimitingLibrary();
    }
  }

  @action
  private setLimitingLibrary(library?: Library) {
    this.limitingLibrary = library;
  }
}
