import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AddCircle, AddCircleOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { DocumentsSelectDialog } from '../../DocumentsSelectDialog/DocumentsSelectDialog';
import { DocumentLibrary, getLibrary } from '../../../services/crg/doc-library.service';
import { LookupAdd } from '../../Lookup/Add/Lookup-Add';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

import { DocumentInfo } from '../Documents';

const cnDocumentsAdd = cn('Documents', 'Add');

interface DocumentsAddProps {
  filled: boolean;
  value: DocumentInfo[];
  libraryIdentifier: string;
  maxDocuments: number;
  onChange(selectedItems: DocumentInfo[]): void;
}

@observer
export class DocumentsAdd extends Component<DocumentsAddProps> {
  @observable private dialogOpen = false;
  @observable private limitingLibrary?: DocumentLibrary;

  render() {
    const { filled, libraryIdentifier, maxDocuments, value, onChange } = this.props;

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

        <DocumentsSelectDialog
          addedDocuments={value}
          libraryIdentifier={libraryIdentifier}
          maxDocuments={maxDocuments}
          onChange={onChange}
          dialogOpen={this.dialogOpen}
          limitingLibrary={this.limitingLibrary}
          onClose={this.closeDialog}
        />
      </LookupAdd>
    );
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
}
