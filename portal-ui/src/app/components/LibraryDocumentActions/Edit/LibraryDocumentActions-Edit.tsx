import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { LibraryRecord, updateLibraryRecord } from '../../../services/crg/doc-library.service';
import { PropertySchema, PropertyType } from '../../../services/crg/schema.models';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';
import { TextBadge } from '../../TextBadge/TextBadge';
import { Form } from '../../Form/Form';

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
    const { as, document } = this.props;

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
          Form={Form}
          open={this.dialogOpen}
          fields={this.fieldsWithoutBinary}
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

  @computed
  private get fieldsWithoutBinary(): PropertySchema<LibraryRecord>[] {
    const { fields = [] } = this.props;

    return fields.filter(({ propertyType }) => propertyType !== PropertyType.BINARY);
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
