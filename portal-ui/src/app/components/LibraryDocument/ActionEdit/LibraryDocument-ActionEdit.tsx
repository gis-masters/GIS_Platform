import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { docLibraryService, LibraryRecord } from '../../../services/crg/doc-library.service';
import { PropertySchema } from '../../../services/crg/schema.models';
import { currentUser } from '../../../stores/CurrentUser.store';
import { Role } from '../../../services/crg/permissions.models';
import { FormDialog } from '../../FormDialog/FormDialog';
import { getPatch } from '../../../services/util/patch';
import { TextBadge } from '../../TextBadge/TextBadge';
import { Button } from '../../Button/Button';

const cnLibraryDocumentActionEdit = cn('LibraryDocument', 'ActionEdit');

interface LibraryDocumentActionEditProps {
  document: LibraryRecord;
  fields: PropertySchema<LibraryRecord>[];
}

@observer
export class LibraryDocumentActionEdit extends Component<LibraryDocumentActionEditProps> {
  @observable private dialogOpen = false;

  render() {
    const { document, fields } = this.props;

    return (
      <>
        <Button
          className={cnLibraryDocumentActionEdit()}
          onClick={this.openDialog}
          disabled={!(currentUser.isAdmin || document.role === Role.OWNER || document.role === Role.CONTRIBUTOR)}
        >
          Редактировать
        </Button>

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
    await docLibraryService.updateRecord(
      this.props.document.libraryId,
      this.props.document.id,
      getPatch(value, this.props.document)
    );
  }
}
