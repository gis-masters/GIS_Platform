import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, type DialogProps, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { type UtilityDialogInfo } from '../../stores/UtilityDialogs.store';
import { Button, type ButtonProps } from '../Button/Button';
import { UtilityDialogContent } from './Content/UtilityDialog-Content.composed';

const cnUtilityDialog = cn('UtilityDialog');

interface UtilityDialogProps {
  info: UtilityDialogInfo;
}

const defaultSubmitTexts: Record<UtilityDialogInfo['type'], string> = {
  achtung: 'Понятно',
  konfirmieren: 'Да',
  prompto: 'OK',
  formPrompt: 'OK'
};

const defaultCancelTexts: Record<UtilityDialogInfo['type'], string> = {
  achtung: '',
  konfirmieren: 'Нет',
  prompto: 'Отмена',
  formPrompt: 'Отмена'
};

@observer
export class UtilityDialog extends Component<UtilityDialogProps> {
  render() {
    const {
      id,
      title,
      type,
      okText,
      cancelText,
      message,
      open,
      submitProps: extraSubmitProps,
      SubmitComponent,
      submitData
    } = this.props.info;
    const formId = `UtilityDialogForm_${id}`;
    const submitText = extraSubmitProps?.children ?? okText ?? defaultSubmitTexts[type];
    const submitProps: ButtonProps =
      type === 'prompto' || type === 'formPrompt'
        ? { form: formId, type: 'submit', ...extraSubmitProps }
        : { onClick: this.handleOk, ...extraSubmitProps };
    const baseDialogProps: Partial<DialogProps> = type === 'formPrompt' ? { fullWidth: true, maxWidth: 'md' } : {};

    return (
      <Dialog
        {...baseDialogProps}
        slotProps={{ paper: { className: cnUtilityDialog({ type }) } }}
        open={Boolean(open)}
        onClose={this.handleClose}
        {...this.props.info.dialogProps}
      >
        {title && <DialogTitle className={cnUtilityDialog('Title')}>{title}</DialogTitle>}
        {(message || type === 'prompto') && <UtilityDialogContent info={this.props.info} type={type} formId={formId} />}
        <DialogActions className={cnUtilityDialog('Actions')}>
          {SubmitComponent ? (
            <SubmitComponent formId={formId} submit={this.submitForm} submitData={submitData ?? {}} />
          ) : (
            <Button {...submitProps} color='primary' autoFocus={type !== 'prompto'}>
              {submitText}
            </Button>
          )}
          {type !== 'achtung' && <Button onClick={this.handleClose}>{cancelText || defaultCancelTexts[type]}</Button>}
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private submitForm() {
    const formId = `UtilityDialogForm_${this.props.info.id}`;
    const form = document.querySelector<HTMLFormElement>(`#${formId}`);

    if (form) {
      form.requestSubmit();
    }
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
