import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { StorageOutlined, TableViewOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';

import { DocumentLibrary, LibraryRecord } from '../../services/data/doc-library.service';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { DocumentInfo } from '../Documents/Documents';
import { route } from '../../stores/Route.store';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./DocumentsSelectDialog.scss';

const cnDocumentsSelectDialog = cn('DocumentsSelectDialog');

interface DocumentsSelectDialogProps {
  addedDocuments: DocumentInfo[];
  libraryIdentifier: string;
  maxDocuments: number;
  dialogOpen: boolean;
  limitingLibrary?: DocumentLibrary;
  onChange(selectedItems: DocumentInfo[]): void;
  onClose: () => void;
}

@observer
export class DocumentsSelectDialog extends Component<DocumentsSelectDialogProps> {
  @observable private selectedDocuments?: LibraryRecord[] = [];
  @observable private libraryView = false;
  @observable private error = false;

  constructor(props: DocumentsSelectDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { libraryIdentifier, maxDocuments, dialogOpen, addedDocuments } = this.props;

    return (
      <Dialog
        className={cnDocumentsSelectDialog()}
        open={dialogOpen}
        onClose={this.closeDialog}
        maxWidth={this.libraryView ? 'xl' : 'md'}
      >
        <DialogTitle>Выберите документ</DialogTitle>

        <div className={cnDocumentsSelectDialog('Switcher')}>
          <Tooltip title={this.libraryView ? 'Вложенный список документов' : 'Таблица документов'}>
            <IconButton onClick={this.toggleRegisterView}>
              {this.libraryView ? <StorageOutlined /> : <TableViewOutlined />}
            </IconButton>
          </Tooltip>
        </div>

        <DialogContent>
          {!this.libraryView ? (
            <RegistryConsumer id='common'>
              {({ Explorer }) => (
                <Explorer
                  id='DocumentsAdd'
                  className={cnDocumentsSelectDialog('Explorer')}
                  preset={!this.path && ExplorerItemType.LIBRARY_ROOT}
                  path={this.path}
                  onSelect={this.handleSelect}
                  onOpen={this.handleOpen}
                  disabledTester={this.testForDisabled}
                />
              )}
            </RegistryConsumer>
          ) : (
            <RegistryConsumer id='common'>
              {({ LibraryRegistry }) => (
                <LibraryRegistry
                  id='DocumentsAdd'
                  onSelect={this.handleMultipleSelect}
                  checkedLibraryDocuments={this.selectedDocuments || []}
                  libraryId={libraryIdentifier || route.params.libraryId}
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
  private get path(): ExplorerItemData[] | undefined {
    if (this.props.limitingLibrary) {
      return [{ type: ExplorerItemType.LIBRARY, payload: this.props.limitingLibrary }, emptyItem];
    }
  }

  @boundMethod
  private handleSelect(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.DOCUMENT && !this.testForDisabled(item)) {
      this.select([path[path.length - 1].payload as LibraryRecord]);
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
    if (item.type === ExplorerItemType.DOCUMENT) {
      this.handleSelect(item, path);
      this.submitDialog();
    }
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
    if (type === ExplorerItemType.DOCUMENT) {
      return this.props.addedDocuments.some(
        ({ libraryId, id }) => payload.libraryId === libraryId && payload.id === id
      );
    }

    return false;
  }
}
