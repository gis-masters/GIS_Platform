import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { updateLibraryRecord } from '../../../services/data/library/library.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { PropertySchema, PropertyType, Schema } from '../../../services/data/schema/schema.models';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';
import { TextBadge } from '../../TextBadge/TextBadge';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentActionsEdit = cn('LibraryDocumentActions', 'Edit');
const cnLibraryDocumentActionsEditDialog = cn('LibraryDocumentActions', 'EditDialog');

interface LibraryDocumentActionsEditProps {
  document: LibraryRecord;
  schema: Schema;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsEdit extends Component<LibraryDocumentActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryDocumentActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document, schema } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsEdit()}
          title='Редактировать'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Edit /> : <EditOutlined />}
        />

        <FormDialog
          className={cnLibraryDocumentActionsEditDialog()}
          open={this.dialogOpen}
          schema={{ ...schema, properties: this.fieldsWithoutBinary }}
          value={document}
          actionFunction={this.updateDocument}
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
  private get fieldsWithoutBinary(): PropertySchema[] {
    const { properties = [] } = this.props.schema || {};

    return properties.filter(({ propertyType }) => propertyType !== PropertyType.BINARY);
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
  private async updateDocument(value: LibraryRecord) {
    await updateLibraryRecord(this.props.document, getPatch(value, this.props.document));
  }
}
