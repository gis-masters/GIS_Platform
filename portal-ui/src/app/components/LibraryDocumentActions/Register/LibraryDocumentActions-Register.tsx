import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { ServerError } from '../../../services/api/http.service';
import { communicationService } from '../../../services/communication.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { registerDocument } from '../../../services/data/library/library.service';
import { services } from '../../../services/services';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsRegister = cn('LibraryDocumentActions', 'Register');

interface LibraryDocumentActionsRegisterProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsRegister extends Component<LibraryDocumentActionsRegisterProps> {
  @observable private dialogOpen = false;
  @observable private busy: boolean = false;

  constructor(props: LibraryDocumentActionsRegisterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsRegister()}
          title=' Зарегистрировать документ'
          icon={<AssignmentTurnedInOutlined />}
          onClick={this.openDialog}
          as={as}
        />

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

    const { libraryTableName, id } = this.props.document;
    try {
      await registerDocument(libraryTableName, id);
      communicationService.libraryRecordUpdated.emit({ type: 'update', data: this.props.document });
    } catch (error) {
      const err = error as AxiosError<ServerError>;
      const msg = `Не удалось зарегистрировать документ по причине: ${err?.response?.data?.message}`;

      Toast.error(msg);
      services.logger.error(msg, error);
    } finally {
      this.closeDialog();
    }
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
    this.setBtnLoading(false);
  }

  @action.bound
  private setBtnLoading(load: boolean) {
    this.busy = load;
  }
}
