import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { SendAndArchive, SendAndArchiveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { ActionDetailsIntegrationSed } from '../Explorer/Explorer.models';
import { LibraryRecord } from '../../services/crg/doc-library.service';
import { sendToSed } from '../../services/crg/integration.service';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

const cnActionIntegrationSed = cn('ActionIntegrationSed');

interface ActionIntegrationSedProps {
  fullSizeButton?: boolean;
  iconButton?: boolean;
  item: LibraryRecord;
  actionDetails: ActionDetailsIntegrationSed;
}

@observer
export class ActionIntegrationSed extends Component<ActionIntegrationSedProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading: boolean;

  render() {
    const { actionDetails, fullSizeButton, iconButton } = this.props;
    const { visible, disabled } = actionDetails;

    return (
      visible && (
        <>
          {fullSizeButton && (
            <Button className={cnActionIntegrationSed()} onClick={this.openDialog} disabled={disabled}>
              Отправить в СЭД "Диалог"
            </Button>
          )}

          {iconButton && (
            <Tooltip title='Отправить в СЭД "Диалог"'>
              <span>
                <IconButton className={cnActionIntegrationSed()} onClick={this.openDialog} disabled={disabled}>
                  {this.dialogOpen ? <SendAndArchive /> : <SendAndArchiveOutlined />}
                </IconButton>
              </span>
            </Tooltip>
          )}

          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение отправки</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Вы действительно хотите отправить документ в систему электронного документооборота СЭД "Диалог"?
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
      )
    );
  }

  @boundMethod
  private async send() {
    this.setBtnLoading(true);
    const { item } = this.props;

    try {
      await sendToSed(item.libraryId, item.id);
    } catch (error) {
      const { status } = (error as AxiosError)?.response;

      Toast.error({
        message: 'Система электронного документооборота СЭД "Диалог" недоступна',
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
