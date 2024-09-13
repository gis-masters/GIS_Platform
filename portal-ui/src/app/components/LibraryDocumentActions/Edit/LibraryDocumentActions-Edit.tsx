import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { updateLibraryRecord } from '../../../services/data/library/library.service';
import { PropertySchema, PropertyType, Schema } from '../../../services/data/schema/schema.models';
import { ActionTypes, DataTypes } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { getPatch } from '../../../services/util/patch';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FormDialog } from '../../FormDialog/FormDialog';
import { TextBadge } from '../../TextBadge/TextBadge';

const cnLibraryDocumentActionsEdit = cn('LibraryDocumentActions', 'Edit');
const cnLibraryDocumentActionsEditDialog = cn('LibraryDocumentActions', 'EditDialog');

interface LibraryDocumentActionsEditProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema?: Schema;
  disabled?: boolean;
}

@observer
export class LibraryDocumentActionsEdit extends Component<LibraryDocumentActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryDocumentActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document, schema, disabled } = this.props;
    const role = document.role;

    if (!role) {
      return;
    }

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsEdit()}
          title='Редактировать'
          tooltipText={disabled ? getAvailableActionsTooltipByRole(ActionTypes.EDIT, role, DataTypes.DOC) : undefined}
          as={as}
          onClick={this.openDialog}
          disabled={disabled}
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
          closeWithConfirm
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
