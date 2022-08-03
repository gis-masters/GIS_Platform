import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { createLibraryRecord, LibraryRecord } from '../../../services/data/doc-library.service';

import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';

const cnLibraryDocumentActionsDelete = cn('LibraryDocumentActions', 'Edit');

interface LibraryDocumentActionsSaveProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  onSave(created: LibraryRecord): void;
}

@observer
export class LibraryDocumentActionsSave extends Component<LibraryDocumentActionsSaveProps> {
  @observable private busy = false;

  constructor(props: LibraryDocumentActionsSaveProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as } = this.props;

    return (
      <LibraryDocumentActionsItem
        className={cnLibraryDocumentActionsDelete()}
        title='Сохранить'
        color='primary'
        as={as}
        onClick={this.save}
        disabled={this.busy}
        icon={<SaveOutlined />}
      />
    );
  }

  @boundMethod
  private async save() {
    const { document, onSave } = this.props;

    this.setBusy(true);

    const created = await createLibraryRecord(
      { ...document, libraryId: undefined, schemaId: undefined, role: undefined },
      document.libraryId,
      document.schemaId
    );

    if (onSave) {
      onSave(created);
    }

    this.setBusy(false);
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
