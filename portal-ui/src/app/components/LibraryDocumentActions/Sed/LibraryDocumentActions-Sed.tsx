import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { SendAndArchive, SendAndArchiveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { sendToSed } from '../../../services/data/library/library.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsSed = cn('LibraryDocumentActions', 'Sed');

interface LibraryDocumentActionsSedProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsSed extends Component<LibraryDocumentActionsSedProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading: boolean = false;

  constructor(props: LibraryDocumentActionsSedProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsSed()}
          title='Отправить в СЭД "Диалог"'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <SendAndArchive /> : <SendAndArchiveOutlined />}
        />

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Подтверждение отправки</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы действительно хотите отправить документ в систему электронного документооборота "Диалог"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button loading={this.btnLoading} onClick={this.send} color='primary'>
              Отправить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private async send() {
    this.setBtnLoading(true);
    const { document } = this.props;

    try {
      await sendToSed(document.libraryTableName, document.id);
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;

      Toast.error({
        message: 'Система электронного документооборота "Диалог" недоступна',
        details: `Status: ${status}`
      });
    } finally {
      this.setBtnLoading(false);
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
    this.btnLoading = load;
  }
}
