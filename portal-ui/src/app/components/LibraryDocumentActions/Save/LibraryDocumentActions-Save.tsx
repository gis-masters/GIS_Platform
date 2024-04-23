import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { createLibraryRecord } from '../../../services/data/library/library.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentActionsDelete = cn('LibraryDocumentActions', 'Edit');

interface LibraryDocumentActionsSaveProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  onSave?(created: LibraryRecord): void;
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
      <ActionsItem
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
      { ...document, libraryTableName: undefined, schemaId: undefined, role: undefined },
      document.libraryTableName
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
