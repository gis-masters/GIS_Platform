import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AddCircle, AddCircleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Button } from '../../Button/Button';
import { DocumentsSelectDialog } from '../../DocumentsSelectDialog/DocumentsSelectDialog';
import { LookupAdd } from '../../Lookup/Add/Lookup-Add';
import { DocumentInfo } from '../Documents';

const cnDocumentsAdd = cn('Documents', 'Add');

interface DocumentsAddProps {
  filled: boolean;
  value: DocumentInfo[];
  librariesTableNames: string[];
  maxDocuments?: number;
  onChange(selectedItems: DocumentInfo[]): void;
}

@observer
export class DocumentsAdd extends Component<DocumentsAddProps> {
  @observable private dialogOpen = false;

  constructor(props: DocumentsAddProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { filled, maxDocuments, value, librariesTableNames, onChange } = this.props;

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
          librariesTableNames={librariesTableNames}
          maxDocuments={maxDocuments}
          onChange={onChange}
          dialogOpen={this.dialogOpen}
          onClose={this.closeDialog}
        />
      </LookupAdd>
    );
  }

  @boundMethod
  private handleAddClick() {
    this.openDialog();
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
