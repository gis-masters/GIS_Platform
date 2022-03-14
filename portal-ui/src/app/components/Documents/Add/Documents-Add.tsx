import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AddCircle, AddCircleOutline } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { DocumentLibrary, getLibrary, LibraryRecord } from '../../../services/crg/doc-library.service';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { LookupAdd } from '../../Lookup/Add/Lookup-Add';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

import { DocumentInfo } from '../Documents';

const cnDocumentsAdd = cn('Documents', 'Add');

interface DocumentsAddProps {
  filled: boolean;
  value: DocumentInfo[];
  libraryIdentifier: string;
  onChange(selectedItems: DocumentInfo[]): void;
}

@observer
export class DocumentsAdd extends Component<DocumentsAddProps> {
  @observable private dialogOpen = false;
  @observable private limitingLibrary?: DocumentLibrary;
  @observable private selectedDocument?: LibraryRecord;

  render() {
    const { filled } = this.props;

    return (
      <LookupAdd className={cnDocumentsAdd()} filled={filled}>
        <Button
          variant='text'
          startIcon={this.dialogOpen ? <AddCircle /> : <AddCircleOutline />}
          color='primary'
          onClick={this.handleAddClick}
        >
          {filled ? 'Добавить документ' : 'Выбрать документ'}
        </Button>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog} maxWidth='md'>
          <DialogTitle>Выберите документ</DialogTitle>
          <DialogContent>
            <RegistryConsumer id='common'>
              {({ Explorer }) => (
                <Explorer
                  id='DocumentsAdd'
                  preset={!this.path && ExplorerItemType.LIBRARY_ROOT}
                  path={this.path}
                  onSelect={this.handleSelect}
                  onOpen={this.handleOpen}
                  disabledTester={this.testForDisabled}
                />
              )}
            </RegistryConsumer>
          </DialogContent>
          <DialogActions>
            <Button color='primary' disabled={!this.selectedDocument} onClick={this.submitDialog}>
              Выбрать
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </LookupAdd>
    );
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    if (this.limitingLibrary) {
      return [{ type: ExplorerItemType.LIBRARY, payload: this.limitingLibrary }, emptyItem];
    }
  }

  @boundMethod
  private handleSelect(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.DOCUMENT && !this.testForDisabled(item)) {
      this.select(path[path.length - 1].payload as LibraryRecord);
    } else {
      this.select(null);
    }
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.DOCUMENT) {
      this.handleSelect(item, path);
      this.submitDialog();
    }
  }

  @boundMethod
  private async handleAddClick() {
    const { libraryIdentifier } = this.props;

    try {
      if (libraryIdentifier && !this.limitingLibrary) {
        this.setLimitingLibrary(await getLibrary(libraryIdentifier));
      }
      this.openDialog();
    } catch (error) {
      const err = error as AxiosError;
      Toast.warn(`Ошибка доступа к библиотеке документов ${libraryIdentifier}. [${err.message}]`);
    }
  }

  @action
  private select(libraryRecord: LibraryRecord) {
    this.selectedDocument = libraryRecord;
  }

  @action
  private setLimitingLibrary(library: DocumentLibrary) {
    this.limitingLibrary = library;
  }

  @action
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private submitDialog() {
    this.closeDialog();

    this.props.onChange([
      {
        id: this.selectedDocument.id,
        title: this.selectedDocument.title,
        libraryId: this.selectedDocument.libraryId
      }
    ]);

    this.selectedDocument = null;
  }

  @boundMethod
  private testForDisabled({ payload, type }: ExplorerItemData<LibraryRecord>): boolean {
    if (type === ExplorerItemType.DOCUMENT) {
      return this.props.value.some(({ libraryId, id }) => payload.libraryId === libraryId && payload.id === id);
    }

    return false;
  }
}
