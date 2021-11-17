import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { sendToSed } from '../../../services/crg/integration.service';

import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';
import { ActionDetails, ExplorerItemData } from '../Explorer.models';
import { LibraryRecord } from '../../../services/crg/doc-library.service';

const cnExplorerActionDelete = cn('Explorer', 'ActionDelete');

interface ExplorerActionIntegrationSedProps {
  selectedItem: ExplorerItemData;
  actionDetails: ActionDetails;
}

@observer
export class ExplorerActionIntegrationSed extends Component<ExplorerActionIntegrationSedProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading: boolean;

  render() {
    const { actionDetails } = this.props;
    const { visible, disabled, needConfirmation, confirmationText } = actionDetails;

    return (
      visible && (
        <>
          <Button className={cnExplorerActionDelete()} onClick={this.openDialog} disabled={disabled}>
            Отправить в СЕД
          </Button>

          <Dialog open={this.dialogOpen && needConfirmation} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение отправки</DialogTitle>
            <DialogContent>
              <DialogContentText>{confirmationText}</DialogContentText>
              <DialogContentText>
                Вы действительно хотите отправить документ в систему электронного документооборота СЕД "Диалог"?
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
    const { selectedItem } = this.props;
    const record = selectedItem.payload as LibraryRecord;

    try {
      await sendToSed(record.libraryId, record.id);
    } catch (e) {
      const { status } = e.response;

      Toast.error({
        message: 'Система электронного документооборота СЕД "Диалог" недоступна',
        canBeSuppressed: true,
        details: `\n Status: ${status}`
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
