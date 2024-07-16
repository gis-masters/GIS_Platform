import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogProps, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { UtilityDialogInfo } from '../../stores/UtilityDialogs.store';
import { Button, ButtonProps } from '../Button/Button';
import { UtilityDialogContent } from './Content/UtilityDialog-Content.composed';

const cnUtilityDialog = cn('UtilityDialog');

interface UtilityDialogProps {
  info: UtilityDialogInfo;
}

const submitTexts: Record<UtilityDialogInfo['type'], string> = {
  achtung: 'Понятно',
  konfirmieren: 'Да',
  prompto: 'OK',
  formPrompt: 'Печать (PDF)'
};

const cancelTexts: Record<UtilityDialogInfo['type'], string> = {
  achtung: '',
  konfirmieren: 'Нет',
  prompto: 'Отмена',
  formPrompt: 'Отмена'
};

@observer
export class UtilityDialog extends Component<UtilityDialogProps> {
  render() {
    const { id, title, type, okText, cancelText, message, open } = this.props.info;
    const formId = `UtilityDialogForm_${id}`;
    const submitProps: ButtonProps =
      type === 'prompto' || type === 'formPrompt' ? { form: formId, type: 'submit' } : { onClick: this.handleOk };
    const baseDialogProps: Partial<DialogProps> = type === 'formPrompt' ? { fullWidth: true, maxWidth: 'md' } : {};

    return (
      <Dialog
        {...baseDialogProps}
        PaperProps={{ className: cnUtilityDialog({ type }) }}
        open={Boolean(open)}
        onClose={this.handleClose}
        {...this.props.info.dialogProps}
      >
        {title && <DialogTitle className={cnUtilityDialog('Title')}>{title}</DialogTitle>}
        {(message || type === 'prompto') && <UtilityDialogContent info={this.props.info} type={type} formId={formId} />}
        <DialogActions className={cnUtilityDialog('Actions')}>
          <Button {...submitProps} color='primary' autoFocus={type !== 'prompto'}>
            {okText || submitTexts[type]}
          </Button>
          {type !== 'achtung' && <Button onClick={this.handleClose}>{cancelText || cancelTexts[type]}</Button>}
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private handleOk() {
    const { id } = this.props.info;
    communicationService.utilityDialogClosed.emit({ id, answer: true });
  }

  @boundMethod
  private handleClose() {
    communicationService.utilityDialogClosed.emit({ id: this.props.info.id, answer: false });
  }
}
