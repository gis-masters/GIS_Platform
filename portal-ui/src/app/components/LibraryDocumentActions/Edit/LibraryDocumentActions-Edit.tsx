import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { LibraryRecord, updateLibraryRecord } from '../../../services/crg/doc-library.service';
import { PropertySchema } from '../../../services/crg/schema.models';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';
import { TextBadge } from '../../TextBadge/TextBadge';

import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';

const cnLibraryDocumentActionsEdit = cn('LibraryDocumentActions', 'Edit');

interface LibraryDocumentActionsEditProps {
  document: LibraryRecord;
  fields: PropertySchema<LibraryRecord>[];
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsEdit extends Component<LibraryDocumentActionsEditProps> {
  @observable private dialogOpen = false;

  render() {
    const { as, fields, document } = this.props;

    return (
      <>
        <LibraryDocumentActionsItem
          className={cnLibraryDocumentActionsEdit()}
          title='Редактировать'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Edit /> : <EditOutlined />}
        />

        <FormDialog
          open={this.dialogOpen}
          fields={fields}
          value={document}
          actionFunction={this.updateDocumentPage}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title={
            <>
              Редактирование документа
              <TextBadge id={document.id} />
            </>
          }
        />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private async updateDocumentPage(value: LibraryRecord) {
    await updateLibraryRecord(
      this.props.document.libraryId,
      this.props.document.id,
      getPatch(value, this.props.document)
    );
  }
}
