import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import {
  getDocumentPermissions,
  LibraryRecord,
  setDocumentPermission,
  updateLibraryRecord
} from '../../../services/crg/doc-library.service';
import { currentUser } from '../../../stores/CurrentUser.store';
import { PrincipalType, Role, RoleAssignmentBody } from '../../../services/crg/permissions.models';
import { Button } from '../../Button/Button';

import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';

const cnLibraryDocumentActionsRegister = cn('LibraryDocumentActions', 'Register');

interface LibraryDocumentActionsRegisterProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsRegister extends Component<LibraryDocumentActionsRegisterProps> {
  @observable private dialogOpen = false;
  @observable private busy: boolean;

  render() {
    const { as } = this.props;

    return (
      <>
        {this.isRegisterAllowed() && (
          <LibraryDocumentActionsItem
            className={cnLibraryDocumentActionsRegister()}
            title=' Зарегистрировать документ'
            icon={<AssignmentTurnedInOutlined />}
            onClick={this.openDialog}
            as={as}
          />
        )}

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Подтверждение регистрации</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы действительно хотите зарегистрировать документ? Зарегистрированный документ нельзя изменить.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button loading={this.busy} onClick={this.clickHandler} color='primary'>
              Зарегистрировать
            </Button>
            <Button disabled={this.busy} onClick={this.closeDialog}>
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private async clickHandler() {
    this.setBtnLoading(true);
    await this.updateDocument();

    const principals: Pick<RoleAssignmentBody, 'principalId' | 'principalType'>[] = [];
    const permissions = await getDocumentPermissions(this.props.document);

    for (const permission of permissions) {
      if (
        !principals.some(
          ({ principalId, principalType }) =>
            permission.principalId === principalId &&
            permission.principalType === principalType &&
            !(principalId === currentUser.id && principalType === PrincipalType.USER)
        )
      ) {
        principals.push(permission);
      }
    }

    for (const principal of principals) {
      await setDocumentPermission(this.props.document, {
        principalId: principal.principalId,
        principalType: principal.principalType,
        role: Role.VIEWER
      });
    } // TODO: научиться обновлять роль овнеру документа, переделать после правок на бэке (задача #3872)

    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    if (this.busy) {
      return;
    }

    this.dialogOpen = false;
    this.setBtnLoading(false);
  }

  @action.bound
  private setBtnLoading(load: boolean) {
    this.busy = load;
  }

  @boundMethod
  private async updateDocument() {
    const { document } = this.props;
    const { libraryId, id, oktmo } = document;

    const date = moment(new Date());

    await updateLibraryRecord(libraryId, id, {
      gisogd_regdate: date,
      gisogd_regnum: `${oktmo}-${libraryId.split('section')[1]}-${date.year()}-${id}`
    });
  }

  @boundMethod
  private isRegisterAllowed() {
    return (
      !this.props.document.is_folder &&
      'gisogd_regdate' in this.props.document &&
      (this.props.document.role === Role.OWNER || currentUser.isAdmin)
    );
  }
}
