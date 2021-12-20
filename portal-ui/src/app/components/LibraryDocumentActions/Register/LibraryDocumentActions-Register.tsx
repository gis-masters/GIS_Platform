import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { LibraryRecord, registerDocument } from '../../../services/crg/doc-library.service';
import { services } from '../../../services/services';
import { communicationService } from '../../../services/communication.service';
import { Toast } from '../../Toast/Toast';
import { Button } from '../../Button/Button';
import { currentUser } from '../../../stores/CurrentUser.store';
import { Role } from '../../../services/crg/permissions.models';
import { ServerError } from '../../../services/http.service';

import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';

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
        {this.canBeRegistered() && (
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
            <Button loading={this.busy} onClick={this.registerDocument} color='primary'>
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
  private async registerDocument() {
    this.setBtnLoading(true);

    const { libraryId, id } = this.props.document;
    try {
      await registerDocument(libraryId, id);
      communicationService.libraryItemsUpdated.emit();
    } catch (error) {
      const err = error as AxiosError<ServerError>;
      const msg = `Не удалось зарегистрировать документ по причине: ${err?.response?.data?.message}`;

      Toast.error(msg);
      services.logger.error(msg, error);
    } finally {
      this.closeDialog();
      this.setBtnLoading(false);
    }
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
  private canBeRegistered(): boolean {
    const { gisogd_regnum, role } = this.props.document;

    // eslint-disable-next-line camelcase
    return gisogd_regnum === null && (role !== Role.VIEWER || currentUser.isAdmin);
  }
}
